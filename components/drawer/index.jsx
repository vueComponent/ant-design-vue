import classNames from 'classnames'
import VcDrawer from '../vc-drawer/src'
import warning from '../_util/warning'
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import { getClass, getStyle, getComponentFromProp } from '../_util/props-util'

export default {
  name: 'ADrawer',
  props: {
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.func,
      PropTypes.bool,
    ]),
    maskClosable: PropTypes.bool.def(true),
    mask: PropTypes.bool,
    maskStyle: PropTypes.object,
    title: PropTypes.any,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string.def('ant-drawer'),
    placement: PropTypes.string.def('right'),
  },
  mixins: [BaseMixin],
  data () {
    this.destoryClose = false
    this.preVisible = this.$props.visible
    return {
      push: false,
    }
  },
  inject: {
    parentDrawer: {
      default: null,
    },
  },
  provide () {
    return {
      parentDrawer: this,
    }
  },
  updated () {
    this.$nextTick(() => {
      if (this.preVisible !== this.visible && this.parentDrawer) {
        if (this.visible) {
          this.parentDrawer.handlePush()
        } else {
          this.parentDrawer.handlePull()
        }
      }
      this.preVisible = this.visible
    })
  },
  methods: {
    close (e) {
      if (this.visible !== undefined) {
        this.$emit('close', e)
        return
      }
    },
    onMaskClick (e) {
      if (!this.maskClosable) {
        return
      }
      this.close(e)
    },
    handlePush () {
      this.setState({
        push: true,
      })
    },
    handlePull () {
      this.setState({
        push: false,
      })
    },
    onDestoryTransitionEnd () {
      const isDestroyOnClose = this.getDestoryOnClose()
      if (!isDestroyOnClose) {
        return
      }
      if (!this.visible) {
        this.destoryClose = true
        this.$forceUpdate()
      }
    },

    getDestoryOnClose () {
      return this.destroyOnClose && !this.visible
    },

    renderBody () {
      if (this.destoryClose && !this.visible) {
        return null
      }
      this.destoryClose = false
      const { placement } = this.$props

      const containerStyle = placement === 'left' ||
        placement === 'right' ? {
          overflow: 'auto',
          height: '100%',
        } : {}

      const isDestroyOnClose = this.getDestoryOnClose()
      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0
        containerStyle.transition = 'opacity .3s'
      }
      const { prefixCls, closable } = this.$props
      const title = getComponentFromProp(this, 'title')
      const style = getStyle(this)
      let header
      if (title) {
        header = (
          <div class={`${prefixCls}-header`}>
            <div class={`${prefixCls}-title`}>{title}</div>
          </div>
        )
      }
      let closer
      if (closable) {
        closer = (
          <button
            onClick={this.close}
            aria-label='Close'
            class={`${prefixCls}-close`}
          >
            <span class={`${prefixCls}-close-x`} />
          </button>
        )
      }

      return (
        <div
          class={`${prefixCls}-wrapper-body`}
          style={containerStyle}
          onTransitionend={this.onDestoryTransitionEnd}
        >
          {header}
          {closer}
          <div class={`${prefixCls}-body`} style={style}>
            {this.$slots.default}
          </div>
        </div>
      )
    },
  },
  render () {
    const { zIndex, visible, placement, wrapClassName, mask, ...rest } = this.$props
    warning(wrapClassName === undefined, 'wrapClassName is deprecated, please use className instead.')
    const vcDrawerStyle = this.push
      ? {
        zIndex,
        transform: `translateX(${placement === 'left' ? 180 : -180}px)`,
      }
      : { zIndex }
    const className = getClass(this)
    const vcDrawerProps = {
      props: {
        handler: false,
        open: visible,
        showMask: mask,
        placement,
        ...rest,
      },
      on: {
        maskClick: this.onMaskClick,
        ...this.$listeners,
      },
      style: vcDrawerStyle,
      class: classNames(wrapClassName, className),
    }
    return (
      <VcDrawer
        {...vcDrawerProps}
      >
        {this.renderBody()}
      </VcDrawer>
    )
  },
}
