
import Icon from '../icon'
import classNames from 'classnames'
import BaseMixin from '../_util/BaseMixin'
import PropTypes from '../_util/vue-types'
import getTransitionProps from '../_util/getTransitionProps'
import { getComponentFromProp } from '../_util/props-util'
function noop () { }
export const AlertProps = {
  /**
   * Type of Alert styles, options:`success`, `info`, `warning`, `error`
   */
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  /** Whether Alert can be closed */
  closable: PropTypes.bool,
  /** Close text to show */
  closeText: PropTypes.any,
  /** Content of Alert */
  message: PropTypes.any,
  /** Additional content of Alert */
  description: PropTypes.any,
  /** Callback when close Alert */
  // onClose?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Trigger when animation ending of Alert */
  afterClose: PropTypes.func.def(noop),
  /** Whether to show icon */
  showIcon: PropTypes.bool,
  iconType: PropTypes.string,
  prefixCls: PropTypes.string,
  banner: PropTypes.bool,
}

export default {
  props: AlertProps,
  mixins: [BaseMixin],
  name: 'AAlert',
  data () {
    return {
      closing: true,
      closed: false,
    }
  },
  methods: {
    handleClose (e) {
      e.preventDefault()
      const dom = this.$el
      dom.style.height = `${dom.offsetHeight}px`
      // Magic code
      // 重复一次后才能正确设置 height
      dom.style.height = `${dom.offsetHeight}px`

      this.setState({
        closing: false,
      })
      this.$emit('close', e)
    },
    animationEnd () {
      this.setState({
        closed: true,
        closing: true,
      })
      this.afterClose()
    },
  },

  render () {
    const { prefixCls = 'ant-alert', banner, closing, closed } = this
    let { closable, type, showIcon, iconType } = this
    const closeText = getComponentFromProp(this, 'closeText')
    const description = getComponentFromProp(this, 'description')
    const message = getComponentFromProp(this, 'message')
    // banner模式默认有 Icon
    showIcon = banner && showIcon === undefined ? true : showIcon
    // banner模式默认为警告
    type = banner && type === undefined ? 'warning' : type || 'info'

    if (!iconType) {
      switch (type) {
        case 'success':
          iconType = 'check-circle'
          break
        case 'info':
          iconType = 'info-circle'
          break
        case 'error':
          iconType = 'cross-circle'
          break
        case 'warning':
          iconType = 'exclamation-circle'
          break
        default:
          iconType = 'default'
      }

      // use outline icon in alert with description
      if (description) {
        iconType += '-o'
      }
    }

    const alertCls = classNames(prefixCls, {
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-close`]: !closing,
      [`${prefixCls}-with-description`]: !!description,
      [`${prefixCls}-no-icon`]: !showIcon,
      [`${prefixCls}-banner`]: !!banner,
    })

    // closeable when closeText is assigned
    if (closeText) {
      closable = true
    }

    const closeIcon = closable ? (
      <a onClick={this.handleClose} class={`${prefixCls}-close-icon`}>
        {closeText || <Icon type='cross' />}
      </a>
    ) : null
    const transitionProps = getTransitionProps(`${prefixCls}-slide-up`, {
      appear: false,
      afterLeave: this.animationEnd,
    })
    return closed ? null : (
      <transition {...transitionProps}>
        <div v-show={closing} class={alertCls} data-show={closing}>
          {showIcon ? <Icon class={`${prefixCls}-icon`} type={iconType} /> : null}
          <span class={`${prefixCls}-message`}>{message}</span>
          <span class={`${prefixCls}-description`}>{description}</span>
          {closeIcon}
        </div>
      </transition>
    )
  },
}

