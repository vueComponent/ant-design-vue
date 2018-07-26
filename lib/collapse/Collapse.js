'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _openAnimation = require('../_util/openAnimation');

var _openAnimation2 = _interopRequireDefault(_openAnimation);

var _propsUtil = require('../_util/props-util');

var _src = require('./src');

var _src2 = _interopRequireDefault(_src);

var _commonProps = require('./src/commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: (0, _extends3['default'])({}, _commonProps.collapseProps, {
    bordered: _vueTypes2['default'].bool.def(true),
    openAnimation: _vueTypes2['default'].any.def(_openAnimation2['default']),
    change: _vueTypes2['default'].func.def(function () {}),
    accordion: _vueTypes2['default'].bool
  }),
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        bordered = this.bordered,
        $listeners = this.$listeners;

    var collapseClassName = (0, _defineProperty3['default'])({}, prefixCls + '-borderless', !bordered);
    var rcCollapeProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this)),
      'class': collapseClassName,
      on: $listeners
    };
    return h(
      _src2['default'],
      rcCollapeProps,
      [this.$slots['default']]
    );
  }
};
module.exports = exports['default'];