'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: {
    duration: _vueTypes2['default'].number.def(1.5),
    closable: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string
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
    var className = (_className = {}, (0, _defineProperty3['default'])(_className, '' + componentClass, 1), (0, _defineProperty3['default'])(_className, componentClass + '-closable', closable), _className);
    var style = (0, _propsUtil.getStyle)(this);
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
module.exports = exports['default'];