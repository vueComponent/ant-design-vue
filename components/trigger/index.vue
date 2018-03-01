<script>
import Vue from 'vue'
import PropTypes from '../_util/vue-types'
import contains from '../_util/Dom/contains'
import { hasProp, getComponentFromProp, getEvents, filterEmpty } from '../_util/props-util'
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout'
import addEventListener from '../_util/Dom/addEventListener'
import warning from '../_util/warning'
import Popup from './Popup'
import { getAlignFromPlacement, getPopupClassNameFromAlign, noop } from './utils'
import BaseMixin from '../_util/BaseMixin'
import { cloneElement } from '../_util/vnode'

function returnEmptyString () {
  return ''
}

function returnDocument () {
  return window.document
}
const ALL_HANDLERS = ['click', 'mousedown', 'touchstart', 'mouseenter',
  'mouseleave', 'focus', 'blur', 'contextmenu']

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
        this.fireEvents(h, e)
      }
    })
  },

  mounted () {
    this.$nextTick(() => {
      this.updatedCal()
    })
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
    this.$nextTick(() => {
      this.updatedCal()
    })
  },

  beforeDestroy () {
    this.clearDelayTimer()
    this.clearOutsideHandler()
    if (this._component) {
      this._component.$destroy()
      this._component = null
      this.popupContainer.remove()
    }
  },
  methods: {
    updatedCal () {
      const props = this.$props
      const state = this.$data

      // We must listen to `mousedown` or `touchstart`, edge case:
      // https://github.com/ant-design/ant-design/issues/5804
      // https://github.com/react-component/calendar/issues/250
      // https://github.com/react-component/trigger/issues/50
      if (state.sPopupVisible) {
        let currentDocument
        if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextmenuToShow())) {
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
        // close popup when trigger type contains 'onContextmenu' and document is scrolling.
        if (!this.contextmenuOutsideHandler1 && this.isContextmenuToShow()) {
          currentDocument = currentDocument || props.getDocument()
          this.contextmenuOutsideHandler1 = addEventListener(currentDocument,
            'scroll', this.onContextmenuClose)
        }
        // close popup when trigger type contains 'onContextmenu' and window is blur.
        if (!this.contextmenuOutsideHandler2 && this.isContextmenuToShow()) {
          this.contextmenuOutsideHandler2 = addEventListener(window,
            'blur', this.onContextmenuClose)
        }
      } else {
        this.clearOutsideHandler()
      }
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
      this._component &&
      this._component.$refs.popup &&
      this._component.$refs.popup.getPopupDomNode &&
      contains(this._component.$refs.popup.getPopupDomNode(), e.relatedTarget)) {
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

    onTouchstart (e) {
      this.fireEvents('touchstart', e)
      this.preTouchTime = Date.now()
    },

    onBlur (e) {
      this.fireEvents('blur', e)
      this.clearDelayTimer()
      if (this.isBlurToHide()) {
        this.delaySetPopupVisible(false, this.$props.blurDelay)
      }
    },

    onContextmenu (e) {
      e.preventDefault()
      this.fireEvents('contextmenu', e)
      this.setPopupVisible(true)
    },

    onContextmenuClose () {
      if (this.isContextmenuToShow()) {
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
      event.preventDefault && event.preventDefault()
      if (event.domEvent) {
        event.domEvent.preventDefault()
      }
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
      if (this._component && this._component.$refs.popup && this._component.$refs.popup.getPopupDomNode) {
        return this._component.$refs.popup.getPopupDomNode()
      }
      return null
    },

    getRootDomNode () {
      return this.$el
      // return this.$el.children[0] || this.$el
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
    renderComponent () {
      const self = this
      const mouseProps = {}
      if (this.isMouseEnterToShow()) {
        mouseProps.mouseenter = self.onPopupMouseenter
      }
      if (this.isMouseLeaveToHide()) {
        mouseProps.mouseleave = self.onPopupMouseleave
      }
      const { prefixCls, destroyPopupOnHide, sPopupVisible,
        popupStyle, popupClassName, action,
        popupAnimation, handleGetPopupClassFromAlign, getRootDomNode,
        mask, zIndex, popupTransitionName, getPopupAlign,
        maskAnimation, maskTransitionName, getContainer } = self
      const popupProps = {
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
        popupStyle,
        popupEvents: {
          align: self.$listeners.popupAlign || noop,
          ...mouseProps,
        },
      }
      if (!this._component) {
        const div = document.createElement('div')
        this.getContainer().appendChild(div)
        this._component = new Vue({
          data () {
            return {
              popupProps: { ...popupProps },
            }
          },
          parent: self,
          el: div,
          render () {
            const { popupEvents, ...otherProps } = this.popupProps
            const p = {
              props: otherProps,
              on: popupEvents,
              ref: 'popup',
              // style: popupStyle,
            }
            return (
              <Popup
                {...p}
              >
                {getComponentFromProp(self, 'popup')}
              </Popup>
            )
          },
        })
      } else {
        this._component.popupProps = popupProps
      }
    },

    getContainer () {
      const { $props: props } = this
      const popupContainer = document.createElement('div')
      // Make sure default popup container will never cause scrollbar appearing
      // https://github.com/react-component/trigger/issues/41
      popupContainer.style.position = 'absolute'
      popupContainer.style.top = '0'
      popupContainer.style.left = '0'
      popupContainer.style.width = '100%'
      const mountNode = props.getPopupContainer
        ? props.getPopupContainer(this.$el) : props.getDocument().body
      mountNode.appendChild(popupContainer)
      this.popupContainer = popupContainer
      return popupContainer
    },

    setPopupVisible (sPopupVisible) {
      this.clearDelayTimer()
      if (this.$data.sPopupVisible !== sPopupVisible) {
        if (!hasProp(this, 'popupVisible')) {
          this.setState({
            sPopupVisible,
          })
        }
        this.$listeners.popupVisibleChange && this.$listeners.popupVisibleChange(sPopupVisible)
      }
    },

    delaySetPopupVisible (visible, delayS) {
      const delay = delayS * 1000
      this.clearDelayTimer()
      if (delay) {
        this.delayTimer = requestAnimationTimeout(() => {
          this.setPopupVisible(visible)
          this.clearDelayTimer()
        }, delay)
      } else {
        this.setPopupVisible(visible)
      }
    },

    clearDelayTimer () {
      if (this.delayTimer) {
        cancelAnimationTimeout(this.delayTimer)
        this.delayTimer = null
      }
    },

    clearOutsideHandler () {
      if (this.clickOutsideHandler) {
        this.clickOutsideHandler.remove()
        this.clickOutsideHandler = null
      }

      if (this.contextmenuOutsideHandler1) {
        this.contextmenuOutsideHandler1.remove()
        this.contextmenuOutsideHandler1 = null
      }

      if (this.contextmenuOutsideHandler2) {
        this.contextmenuOutsideHandler2.remove()
        this.contextmenuOutsideHandler2 = null
      }

      if (this.touchOutsideHandler) {
        this.touchOutsideHandler.remove()
        this.touchOutsideHandler = null
      }
    },

    createTwoChains (event) {
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

    isContextmenuToShow () {
      const { action, showAction } = this.$props
      return action.indexOf('contextmenu') !== -1 || showAction.indexOf('contextmenu') !== -1
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
      if (this.$data.sPopupVisible && this._component && this._component.$refs.popup && this._component.$refs.popup.$refs.alignInstance) {
        this._component.$refs.popup.$refs.alignInstance.forceAlign()
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

    if (this.isContextmenuToShow()) {
      newChildProps.on.contextmenu = this.onContextmenu
    } else {
      newChildProps.on.contextmenu = this.createTwoChains('contextmenu')
    }

    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.on.click = this.onClick
      newChildProps.on.mousedown = this.onMousedown
      newChildProps.on.touchstart = this.onTouchstart
    } else {
      newChildProps.on.click = this.createTwoChains('click')
      newChildProps.on.mousedown = this.createTwoChains('mousedown')
      newChildProps.on.touchstart = this.createTwoChains('onTouchstart')
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.on.mouseenter = this.onMouseenter
    } else {
      newChildProps.on.mouseenter = this.createTwoChains('mouseenter')
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.on.mouseleave = this.onMouseleave
    } else {
      newChildProps.on.mouseleave = this.createTwoChains('mouseleave')
    }

    if (this.isFocusToShow() || this.isBlurToHide()) {
      newChildProps.on.focus = this.onFocus
      newChildProps.on.blur = this.onBlur
    } else {
      newChildProps.on.focus = this.createTwoChains('focus')
      newChildProps.on.blur = this.createTwoChains('blur')
    }
    const { sPopupVisible, forceRender } = this
    if (sPopupVisible || forceRender || this._component) {
      this.renderComponent(h)
    }
    const trigger = cloneElement(child, newChildProps)
    return trigger
  },
}

</script>
