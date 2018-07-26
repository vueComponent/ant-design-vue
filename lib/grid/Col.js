'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColProps = exports.ColSize = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var stringOrNumber = _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]);

var ColSize = exports.ColSize = _vueTypes2['default'].shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber
}).loose;

var objectOrNumber = _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]);

var ColProps = exports.ColProps = {
  span: objectOrNumber,
  order: objectOrNumber,
  offset: objectOrNumber,
  push: objectOrNumber,
  pull: objectOrNumber,
  xs: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]),
  sm: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]),
  md: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]),
  lg: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]),
  xl: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]),
  xxl: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, ColSize]),
  prefixCls: _vueTypes2['default'].string
};

exports['default'] = {
  props: ColProps,
  name: 'ACol',
  render: function render() {
    var _this = this,
        _extends3;

    var h = arguments[0];
    var span = this.span,
        order = this.order,
        offset = this.offset,
        push = this.push,
        pull = this.pull,
        _prefixCls = this.prefixCls,
        prefixCls = _prefixCls === undefined ? 'ant-col' : _prefixCls,
        $slots = this.$slots,
        $attrs = this.$attrs,
        $listeners = this.$listeners;

    var sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(function (size) {
      var _extends2;

      var sizeProps = {};
      if (typeof _this[size] === 'number') {
        sizeProps.span = _this[size];
      } else if ((0, _typeof3['default'])(_this[size]) === 'object') {
        sizeProps = _this[size] || {};
      }

      sizeClassObj = (0, _extends5['default'])({}, sizeClassObj, (_extends2 = {}, (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-' + sizeProps.span, sizeProps.span !== undefined), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-order-' + sizeProps.order, sizeProps.order || sizeProps.order === 0), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-offset-' + sizeProps.offset, sizeProps.offset || sizeProps.offset === 0), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-push-' + sizeProps.push, sizeProps.push || sizeProps.push === 0), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-pull-' + sizeProps.pull, sizeProps.pull || sizeProps.pull === 0), _extends2));
    });
    var classes = (0, _extends5['default'])((_extends3 = {}, (0, _defineProperty3['default'])(_extends3, prefixCls + '-' + span, span !== undefined), (0, _defineProperty3['default'])(_extends3, prefixCls + '-order-' + order, order), (0, _defineProperty3['default'])(_extends3, prefixCls + '-offset-' + offset, offset), (0, _defineProperty3['default'])(_extends3, prefixCls + '-push-' + push, push), (0, _defineProperty3['default'])(_extends3, prefixCls + '-pull-' + pull, pull), _extends3), sizeClassObj);
    var divProps = {
      on: $listeners,
      attrs: $attrs,
      'class': classes
    };
    return h(
      'div',
      divProps,
      [$slots['default']]
    );
  }
};