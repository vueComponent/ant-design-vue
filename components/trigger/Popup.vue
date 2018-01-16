<script>
import PropTypes from '../_util/vue-types'
import Align from '../align'
import PopupInner from './PopupInner'
import LazyRenderBox from './LazyRenderBox'
import { noop } from './utils'
import animate from 'css-animation'

export default {
  props: {
    visible: PropTypes.bool,
    getClassNameFromAlign: PropTypes.func,
    getRootDomNode: PropTypes.func,
    align: PropTypes.any,
    destroyPopupOnHide: PropTypes.bool,
    prefixCls: PropTypes.string,
    getContainer: PropTypes.func,
    transitionName: PropTypes.string,
    animation: PropTypes.any,
    maskAnimation: PropTypes.string,
    maskTransitionName: PropTypes.string,
    mask: PropTypes.bool,
    zIndex: PropTypes.number,
    popupClassName: PropTypes.any,
  },
  data () {
    return {
      aligned: false,
      destroyPopup: false,
      initAlign: false, // mounted之后再实例化align,即改变this.$el位置后实例化
    }
  },
  mounted () {
    this.rootNode = this.getPopupDomNode()
    this._container = this.getContainer()
    this._container.appendChild(this.$el)
    this.$nextTick(() => {
      this.initAlign = true
    })
  },
  beforeDestroy () {
    this.$el.remove()
  },
  watch: {
    visible (val) {
      if (val) {
        this.destroyPopup = false
      }
    },
    initAlign (val) {
      if (val) {
        this.$nextTick(() => {
          // console.log(this.$refs.alignInstance.$el)
          // this.$refs.alignInstance.forceAlign()
        })
      }
    },
  },
  methods: {
    onAlign (popupDomNode, align) {
      const props = this.$props
      const currentAlignClassName = props.getClassNameFromAlign(align)
      if (this.currentAlignClassName !== currentAlignClassName) {
        popupDomNode.className = popupDomNode.className.replace(this.currentAlignClassName, currentAlignClassName)
        this.currentAlignClassName = currentAlignClassName
      }
      this.$listeners.align && this.$listeners.align(popupDomNode, align)
    },

    getPopupDomNode () {
      return this.$refs.popupInstance ? this.$refs.popupInstance.$el : null
    },

    getTarget () {
      return this.$props.getRootDomNode()
    },

    getMaskTransitionName () {
      const props = this.$props
      let transitionName = props.maskTransitionName
      const animation = props.maskAnimation
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`
      }
      return transitionName
    },

    getTransitionName () {
      const props = this.$props
      let transitionName = props.transitionName
      if (!transitionName && typeof props.animation === 'string') {
        transitionName = `${props.animation}`
      }
      return transitionName
    },

    getClassName (currentAlignClassName) {
      return `${this.$props.prefixCls} ${this.$props.popupClassName} ${currentAlignClassName}`
    },
    getPopupElement () {
      const { $props: props, $slots, $listeners, getTransitionName } = this
      const { align, visible, prefixCls, animation } = props
      const { mouseenter, mouseleave } = $listeners
      this.currentAlignClassName = this.currentAlignClassName || props.getClassNameFromAlign(align)
      const className = this.getClassName(this.currentAlignClassName)
      // const hiddenClassName = `${prefixCls}-hidden`
      if (!visible) {
        this.currentAlignClassName = null
      }
      // visible = true
      const popupInnerProps = {
        props: {
          prefixCls,
          visible,
          // hiddenClassName,
        },
        class: `${className}`,
        on: {
          mouseenter: mouseenter || noop,
          mouseleave: mouseleave || noop,
        },
        ref: 'popupInstance',
        style: { ...this.getZIndexStyle() },
      }
      const transitionProps = {
        props: Object.assign({
          appear: true,
          css: false,
        }),
      }
      let opacity = '1'
      const transitionName = getTransitionName()
      const transitionEvent = {
        beforeEnter: (el) => {
          opacity = el.style.opacity
          el.style.opacity = '0'
          !this.aligned && this.$refs.alignInstance.forceAlign()
          this.aligned = true
        },
        enter: (el, done) => {
          el.style.opacity = opacity
          animate(el, `${transitionName}-enter`, done)
        },
        leave: (el, done) => {
          animate(el, `${transitionName}-leave`, done)
        },
        afterLeave: (el) => {
          if (this.destroyPopupOnHide) {
            this.destroyPopup = true
          }
        },
      }

      if (typeof animation === 'object') {
        const { on = {}, ...otherProps } = animation
        transitionProps.props = { ...transitionProps.props, ...otherProps }
        transitionProps.on = { ...on, afterLeave: (el) => {
          transitionEvent.afterLeave(el)
          on.afterLeave && on.afterLeave(el)
        } }
      } else {
        transitionProps.on = transitionEvent
      }
      return (<transition
        {...transitionProps}
      >
        <Align
          v-show={visible}
          target={this.getTarget}
          key='popup'
          ref='alignInstance'
          monitorWindowResize
          disabled={!visible}
          align={align}
          onAlign={this.onAlign}
        >
          <PopupInner
            {...popupInnerProps}
          >
            {$slots.default}
          </PopupInner>
        </Align>
      </transition>)
    },

    getZIndexStyle () {
      const style = {}
      const props = this.$props
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex
      }
      return style
    },

    getMaskElement () {
      const props = this.$props
      let maskElement
      if (props.mask) {
        const maskTransition = this.getMaskTransitionName()
        maskElement = (
          <LazyRenderBox
            v-show={props.visible}
            style={this.getZIndexStyle()}
            key='mask'
            class={`${props.prefixCls}-mask`}
            visible={props.visible}
          />
        )
        if (maskTransition) {
          maskElement = (
            <transition
              appear
              name={maskTransition}
            >
              {maskElement}
            </transition>
          )
        }
      }
      return maskElement
    },
  },

  render () {
    const { destroyPopup, getMaskElement, getPopupElement, initAlign } = this
    return (
      <div style='position: absolute; top: 0px; left: 0px; width: 100%;'>
        {initAlign ? (
          getMaskElement(),
          destroyPopup
            ? null : getPopupElement()
        ) : null }

      </div>
    )
  },
}

</script>

