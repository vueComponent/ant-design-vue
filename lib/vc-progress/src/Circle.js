'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../../_util/props-util');

var _enhancer = require('./enhancer');

var _enhancer2 = _interopRequireDefault(_enhancer);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var circlePropTypes = (0, _extends3['default'])({}, _types.propTypes, {
  gapPosition: _vueTypes2['default'].oneOf(['top', 'bottom', 'left', 'right']),
  gapDegree: _vueTypes2['default'].number
});

var circleDefaultProps = (0, _extends3['default'])({}, _types.defaultProps, {
  gapPosition: 'top'
});

var Circle = {
  props: (0, _propsUtil.initDefaultProps)(circlePropTypes, circleDefaultProps),
  methods: {
    getPathStyles: function getPathStyles() {
      var _$props = this.$props,
          percent = _$props.percent,
          strokeWidth = _$props.strokeWidth,
          _$props$gapDegree = _$props.gapDegree,
          gapDegree = _$props$gapDegree === undefined ? 0 : _$props$gapDegree,
          gapPosition = _$props.gapPosition;

      var radius = 50 - strokeWidth / 2;
      var beginPositionX = 0;
      var beginPositionY = -radius;
      var endPositionX = 0;
      var endPositionY = -2 * radius;
      switch (gapPosition) {
        case 'left':
          beginPositionX = -radius;
          beginPositionY = 0;
          endPositionX = 2 * radius;
          endPositionY = 0;
          break;
        case 'right':
          beginPositionX = radius;
          beginPositionY = 0;
          endPositionX = -2 * radius;
          endPositionY = 0;
          break;
        case 'bottom':
          beginPositionY = radius;
          endPositionY = 2 * radius;
          break;
        default:
      }
      var pathString = 'M 50,50 m ' + beginPositionX + ',' + beginPositionY + '\n       a ' + radius + ',' + radius + ' 0 1 1 ' + endPositionX + ',' + -endPositionY + '\n       a ' + radius + ',' + radius + ' 0 1 1 ' + -endPositionX + ',' + endPositionY;
      var len = Math.PI * 2 * radius;
      var trailPathStyle = {
        strokeDasharray: len - gapDegree + 'px ' + len + 'px',
        strokeDashoffset: '-' + gapDegree / 2 + 'px',
        transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
      };
      var strokePathStyle = {
        strokeDasharray: percent / 100 * (len - gapDegree) + 'px ' + len + 'px',
        strokeDashoffset: '-' + gapDegree / 2 + 'px',
        transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s' // eslint-disable-line
      };
      return { pathString: pathString, trailPathStyle: trailPathStyle, strokePathStyle: strokePathStyle };
    }
  },
  render: function render() {
    var h = arguments[0];
    var _$props2 = this.$props,
        prefixCls = _$props2.prefixCls,
        strokeWidth = _$props2.strokeWidth,
        trailWidth = _$props2.trailWidth,
        strokeColor = _$props2.strokeColor,
        trailColor = _$props2.trailColor,
        strokeLinecap = _$props2.strokeLinecap,
        percent = _$props2.percent,
        restProps = (0, _objectWithoutProperties3['default'])(_$props2, ['prefixCls', 'strokeWidth', 'trailWidth', 'strokeColor', 'trailColor', 'strokeLinecap', 'percent']);

    var _getPathStyles = this.getPathStyles(),
        pathString = _getPathStyles.pathString,
        trailPathStyle = _getPathStyles.trailPathStyle,
        strokePathStyle = _getPathStyles.strokePathStyle;

    delete restProps.percent;
    delete restProps.gapDegree;
    delete restProps.gapPosition;
    var pathFirst = {
      attrs: {
        'd': pathString,
        'stroke': trailColor,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0'
      },
      'class': prefixCls + '-circle-trail',
      style: trailPathStyle
    };
    var pathSecond = {
      attrs: {
        'd': pathString,
        'stroke-linecap': strokeLinecap,
        'stroke': strokeColor,
        'stroke-width': percent === 0 ? 0 : strokeWidth,
        'fill-opacity': '0'
      },
      'class': prefixCls + '-circle-path',
      style: strokePathStyle,
      ref: 'svgPathRef'
    };
    return h(
      'svg',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        'class': prefixCls + '-circle',
        attrs: { viewBox: '0 0 100 100'
        }
      }, restProps]),
      [h('path', pathFirst), percent > 0 ? h('path', pathSecond) : null]
    );
  }
};

exports['default'] = (0, _enhancer2['default'])(Circle);
module.exports = exports['default'];