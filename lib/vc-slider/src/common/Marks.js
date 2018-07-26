'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Marks = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var _context$props = context.props,
        className = _context$props.className,
        vertical = _context$props.vertical,
        marks = _context$props.marks,
        included = _context$props.included,
        upperBound = _context$props.upperBound,
        lowerBound = _context$props.lowerBound,
        max = _context$props.max,
        min = _context$props.min;
    // antd未开发完成
    // const { clickLabel } = context.listeners

    var marksKeys = Object.keys(marks);
    var marksCount = marksKeys.length;
    var unit = marksCount > 1 ? 100 / (marksCount - 1) : 100;
    var markWidth = unit * 0.9;

    var range = max - min;
    var elements = marksKeys.map(parseFloat).sort(function (a, b) {
      return a - b;
    }).map(function (point) {
      var _classNames;

      var markPoint = marks[point];
      var markPointIsObject = (typeof markPoint === 'undefined' ? 'undefined' : (0, _typeof3['default'])(markPoint)) === 'object' && !(0, _propsUtil.isValidElement)(markPoint);
      var markLabel = markPointIsObject ? markPoint.label : markPoint;
      if (!markLabel && markLabel !== 0) {
        return null;
      }

      var isActive = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
      var markClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, className + '-text', true), (0, _defineProperty3['default'])(_classNames, className + '-text-active', isActive), _classNames));

      var bottomStyle = {
        marginBottom: '-50%',
        bottom: (point - min) / range * 100 + '%'
      };

      var leftStyle = {
        width: markWidth + '%',
        marginLeft: -markWidth / 2 + '%',
        left: (point - min) / range * 100 + '%'
      };

      var style = vertical ? bottomStyle : leftStyle;
      var markStyle = markPointIsObject ? (0, _extends3['default'])({}, style, markPoint.style) : style;
      return h(
        'span',
        {
          'class': markClassName,
          style: markStyle,
          key: point
          // onMousedown={(e) => clickLabel(e, point)}
          // onTouchstart={(e) => clickLabel(e, point)}
        },
        [markLabel]
      );
    });

    return h(
      'div',
      { 'class': className },
      [elements]
    );
  }
};

exports['default'] = Marks;
module.exports = exports['default'];