'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonGroupProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonGroupProps = {
  prefixCls: {
    'default': 'ant-btn-group',
    type: String
  },
  size: {
    validator: function validator(value) {
      return ['small', 'large', 'default'].includes(value);
    }
  }
};
exports.ButtonGroupProps = ButtonGroupProps;
exports['default'] = {
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  data: function data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm'
      }
    };
  },

  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size,
          sizeMap = this.sizeMap;

      var sizeCls = sizeMap[size] || '';
      return [(_ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + sizeCls, sizeCls), _ref)];
    }
  },
  render: function render() {
    var h = arguments[0];
    var classes = this.classes,
        $slots = this.$slots;

    return h(
      'div',
      { 'class': classes },
      [(0, _propsUtil.filterEmpty)($slots['default'])]
    );
  }
};