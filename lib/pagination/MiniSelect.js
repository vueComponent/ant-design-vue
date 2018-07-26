'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _select = require('../select');

var _select2 = _interopRequireDefault(_select);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: (0, _extends3['default'])({}, _select.SelectProps),
  Option: _select2['default'].Option,
  render: function render() {
    var h = arguments[0];

    var selectOptionsProps = (0, _propsUtil.getOptionProps)(this);
    var selelctProps = {
      props: (0, _extends3['default'])({}, selectOptionsProps, {
        size: 'small'
      }),
      on: this.$listeners
    };
    return h(
      _select2['default'],
      selelctProps,
      [(0, _propsUtil.filterEmpty)(this.$slots['default'])]
    );
  }
};
module.exports = exports['default'];