import _defineProperty from 'babel-runtime/helpers/defineProperty';

import Icon from '../icon';
import classNames from 'classnames';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import getTransitionProps from '../_util/getTransitionProps';
import { getComponentFromProp } from '../_util/props-util';
function noop() {}
export var AlertProps = {
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
  banner: PropTypes.bool
};

export default {
  props: AlertProps,
  mixins: [BaseMixin],
  name: 'AAlert',
  data: function data() {
    return {
      closing: true,
      closed: false
    };
  },

  methods: {
    handleClose: function handleClose(e) {
      e.preventDefault();
      var dom = this.$el;
      dom.style.height = dom.offsetHeight + 'px';
      // Magic code
      // 重复一次后才能正确设置 height
      dom.style.height = dom.offsetHeight + 'px';

      this.setState({
        closing: false
      });
      this.$emit('close', e);
    },
    animationEnd: function animationEnd() {
      this.setState({
        closed: true,
        closing: true
      });
      this.afterClose();
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var _prefixCls = this.prefixCls,
        prefixCls = _prefixCls === undefined ? 'ant-alert' : _prefixCls,
        banner = this.banner,
        closing = this.closing,
        closed = this.closed;
    var closable = this.closable,
        type = this.type,
        showIcon = this.showIcon,
        iconType = this.iconType;

    var closeText = getComponentFromProp(this, 'closeText');
    var description = getComponentFromProp(this, 'description');
    var message = getComponentFromProp(this, 'message');
    // banner模式默认有 Icon
    showIcon = banner && showIcon === undefined ? true : showIcon;
    // banner模式默认为警告
    type = banner && type === undefined ? 'warning' : type || 'info';

    if (!iconType) {
      switch (type) {
        case 'success':
          iconType = 'check-circle';
          break;
        case 'info':
          iconType = 'info-circle';
          break;
        case 'error':
          iconType = 'cross-circle';
          break;
        case 'warning':
          iconType = 'exclamation-circle';
          break;
        default:
          iconType = 'default';
      }

      // use outline icon in alert with description
      if (description) {
        iconType += '-o';
      }
    }

    var alertCls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-' + type, true), _defineProperty(_classNames, prefixCls + '-close', !closing), _defineProperty(_classNames, prefixCls + '-with-description', !!description), _defineProperty(_classNames, prefixCls + '-no-icon', !showIcon), _defineProperty(_classNames, prefixCls + '-banner', !!banner), _classNames));

    // closeable when closeText is assigned
    if (closeText) {
      closable = true;
    }

    var closeIcon = closable ? h(
      'a',
      {
        on: {
          'click': this.handleClose
        },
        'class': prefixCls + '-close-icon' },
      [closeText || h(Icon, {
        attrs: { type: 'cross' }
      })]
    ) : null;
    var transitionProps = getTransitionProps(prefixCls + '-slide-up', {
      appear: false,
      afterLeave: this.animationEnd
    });
    return closed ? null : h(
      'transition',
      transitionProps,
      [h(
        'div',
        {
          directives: [{
            name: 'show',
            value: closing
          }],
          'class': alertCls },
        [showIcon ? h(Icon, { 'class': prefixCls + '-icon', attrs: { type: iconType }
        }) : null, h(
          'span',
          { 'class': prefixCls + '-message' },
          [message]
        ), h(
          'span',
          { 'class': prefixCls + '-description' },
          [description]
        ), closeIcon]
      )]
    );
  }
};