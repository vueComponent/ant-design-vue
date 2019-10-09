import Icon from '../icon';
import classNames from 'classnames';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import getTransitionProps from '../_util/getTransitionProps';
import { getComponentFromProp, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';
function noop() {}
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
  icon: PropTypes.any,
};

const Alert = {
  name: 'AAlert',
  props: AlertProps,
  mixins: [BaseMixin],
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      closing: true,
      closed: false,
    };
  },
  methods: {
    handleClose(e) {
      e.preventDefault();
      const dom = this.$el;
      dom.style.height = `${dom.offsetHeight}px`;
      // Magic code
      // 重复一次后才能正确设置 height
      dom.style.height = `${dom.offsetHeight}px`;

      this.setState({
        closing: false,
      });
      this.$emit('close', e);
    },
    animationEnd() {
      this.setState({
        closed: true,
        closing: true,
      });
      this.afterClose();
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, banner, closing, closed } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('alert', customizePrefixCls);

    let { closable, type, showIcon, iconType } = this;
    const closeText = getComponentFromProp(this, 'closeText');
    const description = getComponentFromProp(this, 'description');
    const message = getComponentFromProp(this, 'message');
    const icon = getComponentFromProp(this, 'icon');
    // banner模式默认有 Icon
    showIcon = banner && showIcon === undefined ? true : showIcon;
    // banner模式默认为警告
    type = banner && type === undefined ? 'warning' : type || 'info';
    let iconTheme = 'filled';
    // should we give a warning?
    // warning(!iconType, `The property 'iconType' is deprecated. Use the property 'icon' instead.`);
    if (!iconType) {
      switch (type) {
        case 'success':
          iconType = 'check-circle';
          break;
        case 'info':
          iconType = 'info-circle';
          break;
        case 'error':
          iconType = 'close-circle';
          break;
        case 'warning':
          iconType = 'exclamation-circle';
          break;
        default:
          iconType = 'default';
      }

      // use outline icon in alert with description
      if (description) {
        iconTheme = 'outlined';
      }
    }

    // closeable when closeText is assigned
    if (closeText) {
      closable = true;
    }

    const alertCls = classNames(prefixCls, {
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-close`]: !closing,
      [`${prefixCls}-with-description`]: !!description,
      [`${prefixCls}-no-icon`]: !showIcon,
      [`${prefixCls}-banner`]: !!banner,
      [`${prefixCls}-closable`]: closable,
    });

    const closeIcon = closable ? (
      <a onClick={this.handleClose} class={`${prefixCls}-close-icon`}>
        {closeText || <Icon type="close" />}
      </a>
    ) : null;

    const iconNode = (icon &&
      (isValidElement(icon) ? (
        cloneElement(icon, {
          class: `${prefixCls}-icon`,
        })
      ) : (
        <span class={`${prefixCls}-icon`}>{icon}</span>
      ))) || <Icon class={`${prefixCls}-icon`} type={iconType} theme={iconTheme} />;

    const transitionProps = getTransitionProps(`${prefixCls}-slide-up`, {
      appear: false,
      afterLeave: this.animationEnd,
    });
    return closed ? null : (
      <transition {...transitionProps}>
        <div v-show={closing} class={alertCls} data-show={closing}>
          {showIcon ? iconNode : null}
          <span class={`${prefixCls}-message`}>{message}</span>
          <span class={`${prefixCls}-description`}>{description}</span>
          {closeIcon}
        </div>
      </transition>
    );
  },
};

/* istanbul ignore next */
Alert.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Alert.name, Alert);
};

export default Alert;
