import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import classNames from 'classnames';
import { isValidElement } from '../../../_util/props-util';

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
      var markPointIsObject = (typeof markPoint === 'undefined' ? 'undefined' : _typeof(markPoint)) === 'object' && !isValidElement(markPoint);
      var markLabel = markPointIsObject ? markPoint.label : markPoint;
      if (!markLabel && markLabel !== 0) {
        return null;
      }

      var isActive = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
      var markClassName = classNames((_classNames = {}, _defineProperty(_classNames, className + '-text', true), _defineProperty(_classNames, className + '-text-active', isActive), _classNames));

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
      var markStyle = markPointIsObject ? _extends({}, style, markPoint.style) : style;
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

export default Marks;