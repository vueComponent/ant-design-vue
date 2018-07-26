'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputNumberProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _src = require('../vc-input-number/src');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var InputNumberProps = exports.InputNumberProps = {
  prefixCls: _vueTypes2['default'].string,
  min: _vueTypes2['default'].number,
  max: _vueTypes2['default'].number,
  value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  step: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  defaultValue: _vueTypes2['default'].number,
  tabIndex: _vueTypes2['default'].number,
  disabled: _vueTypes2['default'].bool,
  size: _vueTypes2['default'].oneOf(['large', 'small', 'default']),
  formatter: _vueTypes2['default'].func,
  parser: _vueTypes2['default'].func,
  placeholder: _vueTypes2['default'].string,
  name: _vueTypes2['default'].string,
  id: _vueTypes2['default'].string,
  precision: _vueTypes2['default'].number,
  autoFocus: _vueTypes2['default'].bool
};

exports['default'] = {
  name: 'AInputNumber',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: (0, _propsUtil.initDefaultProps)(InputNumberProps, {
    prefixCls: 'ant-input-number',
    step: 1
  }),
  methods: {
    focus: function focus() {
      this.$refs.inputNumberRef.focus();
    },
    blur: function blur() {
      this.$refs.inputNumberRef.blur();
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        size = _getOptionProps.size,
        others = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['size']);

    var inputNumberClass = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, this.prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_classNames, this.prefixCls + '-sm', size === 'small'), _classNames));
    var vcInputNumberprops = {
      props: (0, _extends3['default'])({}, others),
      'class': inputNumberClass,
      ref: 'inputNumberRef',
      on: this.$listeners
    };
    return h(_src2['default'], vcInputNumberprops);
  }
};