'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _propsUtil = require('../../_util/props-util');

var _enhancer = require('./enhancer');

var _enhancer2 = _interopRequireDefault(_enhancer);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Line = {
  props: (0, _propsUtil.initDefaultProps)(_types.propTypes, _types.defaultProps),
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        percent = _$props.percent,
        prefixCls = _$props.prefixCls,
        strokeColor = _$props.strokeColor,
        strokeLinecap = _$props.strokeLinecap,
        strokeWidth = _$props.strokeWidth,
        trailColor = _$props.trailColor,
        trailWidth = _$props.trailWidth,
        restProps = (0, _objectWithoutProperties3['default'])(_$props, ['percent', 'prefixCls', 'strokeColor', 'strokeLinecap', 'strokeWidth', 'trailColor', 'trailWidth']);


    delete restProps.gapPosition;

    var pathStyle = {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: 100 - percent + 'px',
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s linear'
    };

    var center = strokeWidth / 2;
    var right = 100 - strokeWidth / 2;
    var pathString = 'M ' + (strokeLinecap === 'round' ? center : 0) + ',' + center + '\n           L ' + (strokeLinecap === 'round' ? right : 100) + ',' + center;
    var viewBoxString = '0 0 100 ' + strokeWidth;
    var pathFirst = {
      attrs: {
        'd': pathString,
        'stroke-linecap': strokeLinecap,
        'stroke': trailColor,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0'
      },
      'class': prefixCls + '-line-trail'
    };
    var pathSecond = {
      attrs: {
        'd': pathString,
        'stroke-linecap': strokeLinecap,
        'stroke': strokeColor,
        'stroke-width': strokeWidth,
        'fill-opacity': '0'
      },
      'class': prefixCls + '-line-path',
      style: pathStyle,
      ref: 'svgPathRef'
    };
    return h(
      'svg',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        'class': prefixCls + '-line',
        attrs: { viewBox: viewBoxString,
          preserveAspectRatio: 'none'
        }
      }, restProps]),
      [h('path', pathFirst), h('path', pathSecond)]
    );
  }
};

exports['default'] = (0, _enhancer2['default'])(Line);
module.exports = exports['default'];