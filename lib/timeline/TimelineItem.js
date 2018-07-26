'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeLineItemProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TimeLineItemProps = exports.TimeLineItemProps = {
  prefixCls: _vueTypes2['default'].string,
  color: _vueTypes2['default'].string,
  dot: _vueTypes2['default'].any,
  pending: _vueTypes2['default'].bool,
  last: _vueTypes2['default'].bool
};

exports['default'] = {
  name: 'ATimelineItem',
  props: (0, _propsUtil.initDefaultProps)(TimeLineItemProps, {
    prefixCls: 'ant-timeline',
    color: 'blue',
    last: false,
    pending: false
  }),
  render: function render() {
    var _classNames, _classNames2;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        _getOptionProps$color = _getOptionProps.color,
        color = _getOptionProps$color === undefined ? '' : _getOptionProps$color,
        last = _getOptionProps.last,
        pending = _getOptionProps.pending;

    var dot = (0, _propsUtil.getComponentFromProp)(this, 'dot');
    var itemClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-item', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-item-last', last), (0, _defineProperty3['default'])(_classNames, prefixCls + '-item-pending', pending), _classNames));

    var dotClassName = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-item-head', true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-item-head-custom', dot), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-item-head-' + color, true), _classNames2));
    var liProps = {
      'class': itemClassName,
      on: this.$listeners
    };
    return h(
      'li',
      liProps,
      [h('div', { 'class': prefixCls + '-item-tail' }), h(
        'div',
        {
          'class': dotClassName,
          style: { borderColor: /blue|red|green/.test(color) ? null : color }
        },
        [dot]
      ), h(
        'div',
        { 'class': prefixCls + '-item-content' },
        [this.$slots['default']]
      )]
    );
  }
};