import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import Icon from '../icon';
import { Circle } from '../vc-progress';

function addUnit(num, unit) {
  var unitType = unit || 'px';
  return num ? num + unitType : null;
}
var statusColorMap = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068'
};

export var ProgressProps = {
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(['line', 'circle', 'dashboard']),
  percent: PropTypes.number,
  successPercent: PropTypes.number,
  format: PropTypes.func,
  status: PropTypes.oneOf(['success', 'active', 'exception']),
  showInfo: PropTypes.bool,
  strokeWidth: PropTypes.number,
  trailColor: PropTypes.string,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  size: PropTypes.oneOf(['default', 'small'])
};

export default {
  name: 'AProgress',
  props: initDefaultProps(ProgressProps, {
    type: 'line',
    percent: 0,
    showInfo: true,
    trailColor: '#f3f3f3',
    prefixCls: 'ant-progress',
    size: 'default'
  }),

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var props = getOptionProps(this);
    var prefixCls = props.prefixCls,
        _props$percent = props.percent,
        percent = _props$percent === undefined ? 0 : _props$percent,
        status = props.status,
        format = props.format,
        trailColor = props.trailColor,
        size = props.size,
        successPercent = props.successPercent,
        type = props.type,
        strokeWidth = props.strokeWidth,
        width = props.width,
        showInfo = props.showInfo,
        _props$gapDegree = props.gapDegree,
        gapDegree = _props$gapDegree === undefined ? 0 : _props$gapDegree,
        gapPosition = props.gapPosition;

    var progressStatus = parseInt(successPercent ? successPercent.toString() : percent.toString(), 10) >= 100 && !('status' in props) ? 'success' : status || 'normal';
    var progressInfo = void 0;
    var progress = void 0;
    var textFormatter = format || function (percentNumber) {
      return percentNumber + '%';
    };

    if (showInfo) {
      var text = void 0;
      var iconType = type === 'circle' || type === 'dashboard' ? '' : '-circle';
      if (progressStatus === 'exception') {
        text = format ? textFormatter(percent) : h(Icon, {
          attrs: { type: 'cross' + iconType }
        });
      } else if (progressStatus === 'success') {
        text = format ? textFormatter(percent) : h(Icon, {
          attrs: { type: 'check' + iconType }
        });
      } else {
        text = textFormatter(percent);
      }
      progressInfo = h(
        'span',
        { 'class': prefixCls + '-text' },
        [text]
      );
    }

    if (type === 'line') {
      var percentStyle = {
        width: percent + '%',
        height: addUnit(strokeWidth) || (size === 'small' ? '6px' : '8px')
      };
      var successPercentStyle = {
        width: successPercent + '%',
        height: addUnit(strokeWidth) || (size === 'small' ? '6px' : '8px')
      };
      var successSegment = successPercent !== undefined ? h('div', { 'class': prefixCls + '-success-bg', style: successPercentStyle }) : null;
      progress = h('div', [h(
        'div',
        { 'class': prefixCls + '-outer' },
        [h(
          'div',
          { 'class': prefixCls + '-inner' },
          [h('div', { 'class': prefixCls + '-bg', style: percentStyle }), successSegment]
        )]
      ), progressInfo]);
    } else if (type === 'circle' || type === 'dashboard') {
      var circleSize = width || 120;
      var circleStyle = {
        width: addUnit(circleSize),
        height: addUnit(circleSize),
        fontSize: addUnit(circleSize * 0.15 + 6)
      };
      var circleWidth = strokeWidth || 6;
      var gapPos = gapPosition || type === 'dashboard' && 'bottom' || 'top';
      var gapDeg = gapDegree || type === 'dashboard' && 75;
      progress = h(
        'div',
        { 'class': prefixCls + '-inner', style: circleStyle },
        [h(Circle, {
          attrs: {
            percent: percent,
            strokeWidth: circleWidth,
            trailWidth: circleWidth,
            strokeColor: statusColorMap[progressStatus],
            trailColor: trailColor,
            prefixCls: prefixCls,
            gapDegree: gapDeg || 0,
            gapPosition: gapPos
          }
        }), progressInfo]
      );
    }

    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-' + (type === 'dashboard' && 'circle' || type), true), _defineProperty(_classNames, prefixCls + '-status-' + progressStatus, true), _defineProperty(_classNames, prefixCls + '-show-info', showInfo), _defineProperty(_classNames, prefixCls + '-' + size, size), _classNames));

    var progressProps = {
      on: this.$listeners,
      'class': classString
    };
    return h(
      'div',
      progressProps,
      [progress]
    );
  }
};