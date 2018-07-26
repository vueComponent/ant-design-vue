'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _vcProgress = require('../vc-progress');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function addUnit(num, unit) {
  var unitType = unit || 'px';
  return num ? num + unitType : null;
}
var statusColorMap = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068'
};

var ProgressProps = exports.ProgressProps = {
  prefixCls: _vueTypes2['default'].string,
  type: _vueTypes2['default'].oneOf(['line', 'circle', 'dashboard']),
  percent: _vueTypes2['default'].number,
  successPercent: _vueTypes2['default'].number,
  format: _vueTypes2['default'].func,
  status: _vueTypes2['default'].oneOf(['success', 'active', 'exception']),
  showInfo: _vueTypes2['default'].bool,
  strokeWidth: _vueTypes2['default'].number,
  trailColor: _vueTypes2['default'].string,
  width: _vueTypes2['default'].number,
  gapDegree: _vueTypes2['default'].number,
  gapPosition: _vueTypes2['default'].oneOf(['top', 'bottom', 'left', 'right']),
  size: _vueTypes2['default'].oneOf(['default', 'small'])
};

exports['default'] = {
  name: 'AProgress',
  props: (0, _propsUtil.initDefaultProps)(ProgressProps, {
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

    var props = (0, _propsUtil.getOptionProps)(this);
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
        text = format ? textFormatter(percent) : h(_icon2['default'], {
          attrs: { type: 'cross' + iconType }
        });
      } else if (progressStatus === 'success') {
        text = format ? textFormatter(percent) : h(_icon2['default'], {
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
        [h(_vcProgress.Circle, {
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

    var classString = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + (type === 'dashboard' && 'circle' || type), true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-status-' + progressStatus, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-show-info', showInfo), (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + size, size), _classNames));

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