import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../_util/vue-types';
import { getStyle } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    duration: PropTypes.number.def(1.5),
    closable: PropTypes.bool,
    prefixCls: PropTypes.string
  },

  mounted: function mounted() {
    this.startCloseTimer();
  },
  beforeDestroy: function beforeDestroy() {
    this.clearCloseTimer();
    this.willDestroy = true; // beforeDestroy调用后依然会触发onMouseleave事件
  },

  methods: {
    close: function close() {
      this.clearCloseTimer();
      this.__emit('close');
    },
    startCloseTimer: function startCloseTimer() {
      var _this = this;

      this.clearCloseTimer();
      if (!this.willDestroy && this.duration) {
        this.closeTimer = setTimeout(function () {
          _this.close();
        }, this.duration * 1000);
      }
    },
    clearCloseTimer: function clearCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    }
  },

  render: function render() {
    var _className;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        closable = this.closable,
        clearCloseTimer = this.clearCloseTimer,
        startCloseTimer = this.startCloseTimer,
        $slots = this.$slots,
        close = this.close;

    var componentClass = prefixCls + '-notice';
    var className = (_className = {}, _defineProperty(_className, '' + componentClass, 1), _defineProperty(_className, componentClass + '-closable', closable), _className);
    var style = getStyle(this);
    return h(
      'div',
      { 'class': className, style: style || { right: '50%' }, on: {
          'mouseenter': clearCloseTimer,
          'mouseleave': startCloseTimer
        }
      },
      [h(
        'div',
        { 'class': componentClass + '-content' },
        [$slots['default']]
      ), closable ? h(
        'a',
        {
          attrs: { tabIndex: '0' },
          on: {
            'click': close
          },
          'class': componentClass + '-close' },
        [h('span', { 'class': componentClass + '-close-x' })]
      ) : null]
    );
  }
};