import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

var Line = {
  props: initDefaultProps(propTypes, defaultProps),
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
        restProps = _objectWithoutProperties(_$props, ['percent', 'prefixCls', 'strokeColor', 'strokeLinecap', 'strokeWidth', 'trailColor', 'trailWidth']);

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
      _mergeJSXProps([{
        'class': prefixCls + '-line',
        attrs: { viewBox: viewBoxString,
          preserveAspectRatio: 'none'
        }
      }, restProps]),
      [h('path', pathFirst), h('path', pathSecond)]
    );
  }
};

export default enhancer(Line);