'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'AInputGroup',
  props: {
    prefixCls: {
      'default': 'ant-input-group',
      type: String
    },
    size: {
      validator: function validator(value) {
        return ['small', 'large', 'default'].includes(value);
      }
    },
    compact: Boolean
  },
  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size,
          _compact = this.compact,
          compact = _compact === undefined ? false : _compact;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_ref, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_ref, prefixCls + '-compact', compact), _ref;
    }
  },
  methods: {},
  render: function render() {
    var h = arguments[0];

    return h(
      'span',
      { 'class': this.classes },
      [(0, _propsUtil.filterEmpty)(this.$slots['default'])]
    );
  }
};
module.exports = exports['default'];