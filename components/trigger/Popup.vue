<script>
import PropTypes from 'vue-types'
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
  },

  mounted () {
    this.rootNode = this.getPopupDomNode()
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
      return this.$refs.popupInstance
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
    getPopupElement () {
      const { $props: props, onMouseEnter, onMouseLeave, $slots } = this
      const { align, visible, prefixCls, destroyPopupOnHide } = props
      const className = this.getClassName(this.currentAlignClassName ||
      props.getClassNameFromAlign(align))
      const hiddenClassName = `${prefixCls}-hidden`
      if (!visible) {
        this.currentAlignClassName = null
      }

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
      if (destroyPopupOnHide) {
        return (<Animate
          component=''
          exclusive
          transitionAppear
          transitionName={this.getTransitionName()}
        >
          {visible ? (<Align
            target={this.getTarget}
            key='popup'
            ref='alignInstance'
            monitorWindowResize
            align={align}
            onAlign={this.onAlign}
          >
            <PopupInner
              {...popupInnerProps}
            >
              {$slots.default}
            </PopupInner>
          </Align>) : null}
        </Animate>)
      }
      popupInnerProps.props.hiddenClassName = hiddenClassName
      return (<Animate
        component=''
        exclusive
        transitionAppear
        transitionName={this.getTransitionName()}
        showProp='xVisible'
      >
        <Align
          target={this.getTarget}
          key='popup'
          ref='alignInstance'
          monitorWindowResize
          xVisible={visible}
          childrenProps={{ visible: 'xVisible' }}
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
      </Animate>)
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
            style={this.getZIndexStyle()}
            key='mask'
            class={`${props.prefixCls}-mask`}
            hiddenClassName={`${props.prefixCls}-mask-hidden`}
            visible={props.visible}
          />
        )
        if (maskTransition) {
          maskElement = (
            <Animate
              key='mask'
              showProp='visible'
              transitionAppear
              component=''
              transitionName={maskTransition}
            >
              {maskElement}
            </Animate>
          )
        }
      }
      return maskElement
    },
  },

  render () {
    return (
      <div>
        {this.getMaskElement()}
        {this.getPopupElement()}
      </div>
    )
  },
}

</script>
