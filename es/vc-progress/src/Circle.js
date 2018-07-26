import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

var circlePropTypes = _extends({}, propTypes, {
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  gapDegree: PropTypes.number
});

var circleDefaultProps = _extends({}, defaultProps, {
  gapPosition: 'top'
});

var Circle = {
  props: initDefaultProps(circlePropTypes, circleDefaultProps),
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
        restProps = _objectWithoutProperties(_$props2, ['prefixCls', 'strokeWidth', 'trailWidth', 'strokeColor', 'trailColor', 'strokeLinecap', 'percent']);

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
      _mergeJSXProps([{
        'class': prefixCls + '-circle',
        attrs: { viewBox: '0 0 100 100'
        }
      }, restProps]),
      [h('path', pathFirst), percent > 0 ? h('path', pathSecond) : null]
    );
  }
};

export default enhancer(Circle);