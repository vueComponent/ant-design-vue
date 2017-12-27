<script>
import PropTypes from '../_util/vue-types'
import Align from '../align'
import PopupInner from './PopupInner'
import LazyRenderBox from './LazyRenderBox'

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
  },
  data () {
    return {
      destroyPopup: false,
    }
  },
  mounted () {
    this.rootNode = this.getPopupDomNode()
    this._container = this.getContainer()
    this._container.appendChild(this.$el)
    this.$nextTick(() => {
      this.$refs.alignInstance.forceAlign()
    })
  },
  watch: {
    visible (val) {
      if (val) {
        this.destroyPopup = false
      }
    },
  },
  methods: {
    onAlign (popupDomNode, align) {
      const props = this.$props
      const currentAlignClassName = props.getClassNameFromAlign(align)
      // FIX: https://github.com/react-component/trigger/issues/56
      // FIX: https://github.com/react-component/tooltip/issues/79
      if (this.currentAlignClassName !== currentAlignClassName) {
        this.currentAlignClassName = currentAlignClassName
        popupDomNode.className = this.getClassName(currentAlignClassName)
      }
      this.$emit('align', popupDomNode, align)
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
      if (!transitionName && props.animation) {
        transitionName = `${props.prefixCls}-${props.animation}`
      }
      return transitionName
    },

    getClassName (currentAlignClassName) {
      return `${this.$props.prefixCls} ${currentAlignClassName}`
    },
    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
    },
    beforeEnter (el) {
      this.$refs.alignInstance && this.$refs.alignInstance.forceAlign()
    },
    afterLeave (el) {
      if (this.destroyPopupOnHide) {
        this.destroyPopup = true
      }
    },
    getPopupElement () {
      const { $props: props, onMouseEnter, onMouseLeave, $slots } = this
      const { align, visible, prefixCls } = props
      const className = this.getClassName(this.currentAlignClassName ||
      props.getClassNameFromAlign(align))
      // const hiddenClassName = `${prefixCls}-hidden`
      if (!visible) {
        this.currentAlignClassName = null
      }
      // visible = true
      const popupInnerProps = {
        props: {
          prefixCls,
          visible,
        },
        class: className,
        on: {
          mouseenter: onMouseEnter,
          mouseleave: onMouseLeave,
        },
        ref: 'popupInstance',
        style: { ...this.getZIndexStyle() },
      }
      return (<transition
        appear
        name={this.getTransitionName()}
        onBeforeEnter={this.beforeEnter}
        onAfterLeave={this.afterLeave}
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
    const { destroyPopup, getMaskElement, getPopupElement } = this
    return (
      <div style='position: absolute; top: 0px; left: 0px; width: 100%;'>
        {getMaskElement()}
        {destroyPopup ? null : getPopupElement()}
      </div>
    )
  },
}

</script>

