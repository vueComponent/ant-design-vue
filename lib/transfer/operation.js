'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferOperationProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

var TransferOperationProps = exports.TransferOperationProps = {
  className: _vueTypes2['default'].string,
  leftArrowText: _vueTypes2['default'].string,
  rightArrowText: _vueTypes2['default'].string,
  moveToLeft: _vueTypes2['default'].any,
  moveToRight: _vueTypes2['default'].any,
  leftActive: _vueTypes2['default'].bool,
  rightActive: _vueTypes2['default'].bool
};

exports['default'] = {
  name: 'Operation',
  props: (0, _extends3['default'])({}, TransferOperationProps),
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        _getOptionProps$moveT = _getOptionProps.moveToLeft,
        moveToLeft = _getOptionProps$moveT === undefined ? noop : _getOptionProps$moveT,
        _getOptionProps$moveT2 = _getOptionProps.moveToRight,
        moveToRight = _getOptionProps$moveT2 === undefined ? noop : _getOptionProps$moveT2,
        _getOptionProps$leftA = _getOptionProps.leftArrowText,
        leftArrowText = _getOptionProps$leftA === undefined ? '' : _getOptionProps$leftA,
        _getOptionProps$right = _getOptionProps.rightArrowText,
        rightArrowText = _getOptionProps$right === undefined ? '' : _getOptionProps$right,
        leftActive = _getOptionProps.leftActive,
        rightActive = _getOptionProps.rightActive;

    return h('div', [h(
      _button2['default'],
      {
        attrs: {
          type: 'primary',
          size: 'small',
          disabled: !leftActive,

          icon: 'left'
        },
        on: {
          'click': moveToLeft
        }
      },
      [leftArrowText]
    ), h(
      _button2['default'],
      {
        attrs: {
          type: 'primary',
          size: 'small',
          disabled: !rightActive,

          icon: 'right'
        },
        on: {
          'click': moveToRight
        }
      },
      [rightArrowText]
    )]);
  }
};