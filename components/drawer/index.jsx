import VcDrawer from '../vc-drawer/src'
import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import { getComponentFromProp, getOptionProps } from '../_util/props-util'

const Drawer = {
  name: 'ADrawer',
  props: {
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.any,
    maskClosable: PropTypes.bool.def(true),
    mask: PropTypes.bool,
    maskStyle: PropTypes.object,
    title: PropTypes.any,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string.def('ant-drawer'),
    placement: PropTypes.string.def('right'),
    level: PropTypes.any.def(null),
    wrapClassName: PropTypes.string,
  },
  mixins: [BaseMixin],
  data () {
    this.destoryClose = false
    this.preVisible = this.$props.visible
    return {
      _push: false,
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
          this.parentDrawer.push()
        } else {
          this.parentDrawer.pull()
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
    push () {
      this.setState({
        _push: true,
      })
    },
    pull () {
      this.setState({
        _push: false,
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
      const { placement, bodyStyle } = this.$props

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
          <div class={`${prefixCls}-body`} style={bodyStyle}>
            {this.$slots.default}
          </div>
        </div>
      )
    },
  },
  render () {
    const props = getOptionProps(this)
    const { zIndex, visible, placement, mask, wrapClassName, ...rest } = props
    const vcDrawerStyle = this.$data._push
      ? {
        zIndex,
        transform: `translateX(${placement === 'left' ? 180 : -180}px)`,
      }
      : { zIndex }
    const vcDrawerProps = {
      props: {
        handler: false,
        open: visible,
        showMask: mask,
        placement,
        wrapClassName,
        ...rest,
      },
      on: {
        maskClick: this.onMaskClick,
        ...this.$listeners,
      },
      style: vcDrawerStyle,

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

/* istanbul ignore next */
Drawer.install = function (Vue) {
  Vue.component(Drawer.name, Drawer)
}

export default Drawer
