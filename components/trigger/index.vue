<script>
import PropTypes from '../_util/vue-types'
import contains from '../_util/Dom/contains'
import hasProp from '../_util/props-util'
import addEventListener from '../_util/Dom/addEventListener'
import warning from '../_util/warning'
import Popup from './Popup'
import { getAlignFromPlacement, getPopupClassNameFromAlign, noop } from './utils'
import BaseMixin from '../_util/BaseMixin'
import { cloneElement, filterEmpty, getEvents } from '../_util/vnode'

function returnEmptyString () {
  return ''
}

function returnDocument () {
  return window.document
}

const ALL_HANDLERS = ['click', 'mousedown', 'touchStart', 'mouseenter',
  'mouseleave', 'focus', 'blur', 'contextMenu']

export default {
  name: 'Trigger',
  props: {
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).def([]),
    showAction: PropTypes.any.def([]),
    hideAction: PropTypes.any.def([]),
    getPopupClassNameFromAlign: PropTypes.any.def(returnEmptyString),
    // onPopupVisibleChange: PropTypes.func.def(noop),
    afterPopupVisibleChange: PropTypes.func.def(noop),
    popup: PropTypes.any,
    popupStyle: PropTypes.object.def({}),
    prefixCls: PropTypes.string.def('rc-trigger-popup'),
    popupClassName: PropTypes.string.def(''),
    popupPlacement: PropTypes.string,
    builtinPlacements: PropTypes.object,
    popupTransitionName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    popupAnimation: PropTypes.any,
    mouseEnterDelay: PropTypes.number.def(0),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    zIndex: PropTypes.number,
    focusDelay: PropTypes.number.def(0),
    blurDelay: PropTypes.number.def(0.15),
    getPopupContainer: PropTypes.func,
    getDocument: PropTypes.func.def(returnDocument),
    forceRender: PropTypes.bool,
    destroyPopupOnHide: PropTypes.bool.def(false),
    mask: PropTypes.bool.def(false),
    maskClosable: PropTypes.bool.def(true),
    // onPopupAlign: PropTypes.func.def(noop),
    popupAlign: PropTypes.object.def({}),
    popupVisible: PropTypes.bool,
    defaultPopupVisible: PropTypes.bool.def(false),
    maskTransitionName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    maskAnimation: PropTypes.string,
  },

  mixins: [BaseMixin],
  data () {
    const props = this.$props
    let popupVisible
    if (hasProp(this, 'popupVisible')) {
      popupVisible = !!props.popupVisible
    } else {
      popupVisible = !!props.defaultPopupVisible
    }
    return {
      sPopupVisible: popupVisible,
    }
  },

  beforeCreate () {
    ALL_HANDLERS.forEach((h) => {
      this[`fire${h}`] = (e) => {
        // const ev = `on${h[0].toUpperCase() + h.slice(1)}`
        this.fireEvents(h, e)
      }
    })
  },

  mounted () {
    this.updatedCal()
  },
  watch: {
    popupVisible (val) {
      if (val !== undefined) {
        this.sPopupVisible = val
      }
    },
    sPopupVisible (val) {
      this.$nextTick(() => {
        this.afterPopupVisibleChange(val)
      })
    },
  },

  updated () {
    this.updatedCal()
  },

  beforeDestroy () {
    this.clearDelayTimer()
    this.clearOutsideHandler()
  },
  methods: {
    updatedCal () {
      const props = this.$props
      const state = this.$data
      // this.renderComponent()

      // We must listen to `mousedown` or `touchstart`, edge case:
      // https://github.com/ant-design/ant-design/issues/5804
      // https://github.com/react-component/calendar/issues/250
      // https://github.com/react-component/trigger/issues/50
      if (state.sPopupVisible) {
        let currentDocument
        if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextMenuToShow())) {
          currentDocument = props.getDocument()
          this.clickOutsideHandler = addEventListener(currentDocument,
            'mousedown', this.onDocumentClick)
        }
        // always hide on mobile
        if (!this.touchOutsideHandler) {
          currentDocument = currentDocument || props.getDocument()
          this.touchOutsideHandler = addEventListener(currentDocument,
            'touchstart', this.onDocumentClick)
        }
        // close popup when trigger type contains 'onContextMenu' and document is scrolling.
        if (!this.contextMenuOutsideHandler1 && this.isContextMenuToShow()) {
          currentDocument = currentDocument || props.getDocument()
          this.contextMenuOutsideHandler1 = addEventListener(currentDocument,
            'scroll', this.onContextMenuClose)
        }
        // close popup when trigger type contains 'onContextMenu' and window is blur.
        if (!this.contextMenuOutsideHandler2 && this.isContextMenuToShow()) {
          this.contextMenuOutsideHandler2 = addEventListener(window,
            'blur', this.onContextMenuClose)
        }
        return
      }

      this.clearOutsideHandler()
    },
    onMouseenter (e) {
      this.fireEvents('mouseenter', e)
      this.delaySetPopupVisible(true, this.$props.mouseEnterDelay)
    },

    onMouseleave (e) {
      this.fireEvents('mouseleave', e)
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay)
    },

    onPopupMouseenter () {
      this.clearDelayTimer()
    },

    onPopupMouseleave (e) {
      if (e.relatedTarget && !e.relatedTarget.setTimeout &&
      this.$refs.popup &&
      this.$refs.popup.getPopupDomNode &&
      contains(this.$refs.popup.getPopupDomNode(), e.relatedTarget)) {
        return
      }
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay)
    },

    onFocus (e) {
      this.fireEvents('focus', e)
      // incase focusin and focusout
      this.clearDelayTimer()
      if (this.isFocusToShow()) {
        this.focusTime = Date.now()
        this.delaySetPopupVisible(true, this.$props.focusDelay)
      }
    },

    onMousedown (e) {
      this.fireEvents('mousedown', e)
      this.preClickTime = Date.now()
    },

    onTouchStart (e) {
      this.fireEvents('touchStart', e)
      this.preTouchTime = Date.now()
    },

    onBlur (e) {
      this.fireEvents('blur', e)
      this.clearDelayTimer()
      if (this.isBlurToHide()) {
        this.delaySetPopupVisible(false, this.$props.blurDelay)
      }
    },

    onContextMenu (e) {
      e.preventDefault()
      this.fireEvents('contextMenu', e)
      this.setPopupVisible(true)
    },

    onContextMenuClose () {
      if (this.isContextMenuToShow()) {
        this.close()
      }
    },

    onClick (event) {
      this.fireEvents('click', event)
      // focus will trigger click
      if (this.focusTime) {
        let preTime
        if (this.preClickTime && this.preTouchTime) {
          preTime = Math.min(this.preClickTime, this.preTouchTime)
        } else if (this.preClickTime) {
          preTime = this.preClickTime
        } else if (this.preTouchTime) {
          preTime = this.preTouchTime
        }
        if (Math.abs(preTime - this.focusTime) < 20) {
          return
        }
        this.focusTime = 0
      }
      this.preClickTime = 0
      this.preTouchTime = 0
      event.preventDefault()
      const nextVisible = !this.$data.sPopupVisible
      if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
        this.setPopupVisible(!this.$data.sPopupVisible)
      }
    },

    onDocumentClick (event) {
      if (this.$props.mask && !this.$props.maskClosable) {
        return
      }
      const target = event.target
      const root = this.$el
      const popupNode = this.getPopupDomNode()
      if (!contains(root, target) && !contains(popupNode, target)) {
        this.close()
      }
    },
    getPopupDomNode () {
    // for test
      if (this.$refs.popup && this.$refs.popup.getPopupDomNode) {
        return this.$refs.popup.getPopupDomNode()
      }
      return null
    },

    getRootDomNode () {
      return this.$el
    },

    handleGetPopupClassFromAlign (align) {
      const className = []
      const props = this.$props
      const { popupPlacement, builtinPlacements, prefixCls } = props
      if (popupPlacement && builtinPlacements) {
        className.push(getPopupClassNameFromAlign(builtinPlacements, prefixCls, align))
      }
      if (props.getPopupClassNameFromAlign) {
        className.push(props.getPopupClassNameFromAlign(align))
      }
      return className.join(' ')
    },

    getPopupAlign () {
      const props = this.$props
      const { popupPlacement, popupAlign, builtinPlacements } = props
      if (popupPlacement && builtinPlacements) {
        return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign)
      }
      return popupAlign
    },
    getComponent (h) {
      const mouseProps = {}
      if (this.isMouseEnterToShow()) {
        mouseProps.mouseenter = this.onPopupMouseenter
      }
      if (this.isMouseLeaveToHide()) {
        mouseProps.mouseleave = this.onPopupMouseleave
      }
      const { prefixCls, destroyPopupOnHide, sPopupVisible,
        popupStyle, popupClassName, action,
        popupAnimation, handleGetPopupClassFromAlign, getRootDomNode,
        mask, zIndex, popupTransitionName, getPopupAlign,
        maskAnimation, maskTransitionName, popup, $slots, getContainer } = this
      const popupProps = {
        props: {
          prefixCls,
          destroyPopupOnHide,
          visible: sPopupVisible,
          action,
          align: getPopupAlign(),
          animation: popupAnimation,
          getClassNameFromAlign: handleGetPopupClassFromAlign,
          getRootDomNode,
          mask,
          zIndex,
          transitionName: popupTransitionName,
          maskAnimation,
          maskTransitionName,
          getContainer,
          popupClassName,
        },
        on: {
          align: this.$listeners.popupAlign || noop,
          ...mouseProps,
        },
        ref: 'popup',
        style: popupStyle,
      }
      return (
        <Popup
          {...popupProps}
          ref='popup'
        >
          {typeof popup === 'function' ? popup(h) : popup}
          {popup === undefined ? $slots.popup : null}
        </Popup>
      )
    },

    getContainer () {
      const { $props: props } = this
      const mountNode = props.getPopupContainer
        ? props.getPopupContainer(this.$el) : props.getDocument().body
      return mountNode
    },

    setPopupVisible (sPopupVisible) {
      this.clearDelayTimer()
      if (this.$data.sPopupVisible !== sPopupVisible) {
        if (!hasProp(this, 'popupVisible')) {
          this.setState({
            sPopupVisible,
          })
          this.$forceUpdate()
        }
        this.$listeners.popupVisibleChange && this.$listeners.popupVisibleChange(sPopupVisible)
      }
    },

    delaySetPopupVisible (visible, delayS) {
      const delay = delayS * 1000
      this.clearDelayTimer()
      if (delay) {
        this.delayTimer = setTimeout(() => {
          this.setPopupVisible(visible)
          this.clearDelayTimer()
        }, delay)
      } else {
        this.setPopupVisible(visible)
      }
    },

    clearDelayTimer () {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
        this.delayTimer = null
      }
    },

    clearOutsideHandler () {
      if (this.clickOutsideHandler) {
        this.clickOutsideHandler.remove()
        this.clickOutsideHandler = null
      }

      if (this.contextMenuOutsideHandler1) {
        this.contextMenuOutsideHandler1.remove()
        this.contextMenuOutsideHandler1 = null
      }

      if (this.contextMenuOutsideHandler2) {
        this.contextMenuOutsideHandler2.remove()
        this.contextMenuOutsideHandler2 = null
      }

      if (this.touchOutsideHandler) {
        this.touchOutsideHandler.remove()
        this.touchOutsideHandler = null
      }
    },

    createTwoChains (event, child) {
      let fn = () => {
      }
      const events = this.$listeners
      if (this.childOriginEvents[event] && events[event]) {
        return this[`fire${event}`]
      }
      fn = this.childOriginEvents[event] || events[event] || fn
      return fn
    },

    isClickToShow () {
      const { action, showAction } = this.$props
      return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1
    },

    isContextMenuToShow () {
      const { action, showAction } = this.$props
      return action.indexOf('contextMenu') !== -1 || showAction.indexOf('contextMenu') !== -1
    },

    isClickToHide () {
      const { action, hideAction } = this.$props
      return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1
    },

    isMouseEnterToShow () {
      const { action, showAction } = this.$props
      return action.indexOf('hover') !== -1 || showAction.indexOf('mouseenter') !== -1
    },

    isMouseLeaveToHide () {
      const { action, hideAction } = this.$props
      return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseleave') !== -1
    },

    isFocusToShow () {
      const { action, showAction } = this.$props
      return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1
    },

    isBlurToHide () {
      const { action, hideAction } = this.$props
      return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1
    },
    forcePopupAlign () {
      if (this.$data.sPopupVisible && this.$refs.popup && this.$refs.popup.$refs.alignInstance) {
        this.$refs.popup.$refs.alignInstance.forceAlign()
      }
    },
    fireEvents (type, e) {
      if (this.childOriginEvents[type]) {
        this.childOriginEvents[type](e)
      }
      this.__emit(type, e)
    },

    close () {
      this.setPopupVisible(false)
    },
  },
  render (h) {
    const children = filterEmpty(this.$slots.default)
    if (children.length > 1) {
      warning(false, 'Trigger $slots.default.length > 1, just support only one default', true)
    }
    const child = children[0]
    this.childOriginEvents = getEvents(child)
    const newChildProps = {
      props: {},
      on: {},
      key: 'trigger',
    }

    if (this.isContextMenuToShow()) {
      newChildProps.on.contextMenu = this.onContextMenu
    } else {
      newChildProps.on.contextMenu = this.createTwoChains('contextMenu', child)
    }

    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.on.click = this.onClick
      newChildProps.on.mousedown = this.onMousedown
      // newChildProps.on.touchStart = this.onTouchStart
    } else {
      newChildProps.on.click = this.createTwoChains('click', child)
      newChildProps.on.mousedown = this.createTwoChains('mousedown', child)
      // newChildProps.on.TouchStart = this.createTwoChains('onTouchStart', child)
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.on.mouseenter = this.onMouseenter
    } else {
      newChildProps.on.mouseenter = this.createTwoChains('mouseenter', child)
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.on.mouseleave = this.onMouseleave
    } else {
      newChildProps.on.mouseleave = this.createTwoChains('mouseleave', child)
    }

    if (this.isFocusToShow() || this.isBlurToHide()) {
      newChildProps.on.focus = this.onFocus
      newChildProps.on.blur = this.onBlur
    } else {
      newChildProps.on.focus = this.createTwoChains('focus', child)
      newChildProps.on.blur = this.createTwoChains('blur', child)
    }
    const { sPopupVisible, forceRender } = this
    if (sPopupVisible || forceRender || this._component) {
      this._component = this.getComponent(h)
    } else {
      this._component = null
    }
    newChildProps.addChildren = this._component
    const trigger = cloneElement(child, newChildProps)
    return trigger
  },
}

</script>
