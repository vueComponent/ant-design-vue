'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = require('../../../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var calcPoints = function calcPoints(vertical, marks, dots, step, min, max) {
  (0, _warning2['default'])(dots ? step > 0 : true, '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
  var points = Object.keys(marks).map(parseFloat);
  if (dots) {
    for (var i = min; i <= max; i = i + step) {
      if (points.indexOf(i) >= 0) continue;
      points.push(i);
    }
  }
  return points;
};

var Steps = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var _context$props = context.props,
        prefixCls = _context$props.prefixCls,
        vertical = _context$props.vertical,
        marks = _context$props.marks,
        dots = _context$props.dots,
        step = _context$props.step,
        included = _context$props.included,
        lowerBound = _context$props.lowerBound,
        upperBound = _context$props.upperBound,
        max = _context$props.max,
        min = _context$props.min,
        dotStyle = _context$props.dotStyle,
        activeDotStyle = _context$props.activeDotStyle;

    var range = max - min;
    var elements = calcPoints(vertical, marks, dots, step, min, max).map(function (point) {
      var _classNames;

      var offset = Math.abs(point - min) / range * 100 + '%';

      var isActived = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
      var style = vertical ? (0, _extends3['default'])({ bottom: offset }, dotStyle) : (0, _extends3['default'])({ left: offset }, dotStyle);
      if (isActived) {
        style = (0, _extends3['default'])({}, style, activeDotStyle);
      }

      var pointClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot-active', isActived), _classNames));

      return h('span', { 'class': pointClassName, style: style, key: point });
    });

    return h(
      'div',
      { 'class': prefixCls + '-step' },
      [elements]
    );
  }
};

exports['default'] = Steps;
module.exports = exports['default'];