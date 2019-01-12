import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

const Line = {
  props: initDefaultProps(propTypes, defaultProps),
  render() {
    const {
      percent,
      prefixCls,
      strokeColor,
      strokeLinecap,
      strokeWidth,
      trailColor,
      trailWidth,
      ...restProps
    } = this.$props;

    delete restProps.gapPosition;

    const pathStyle = {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: `${100 - percent}px`,
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s linear',
    };

    const center = strokeWidth / 2;
    const right = 100 - strokeWidth / 2;
    const pathString = `M ${strokeLinecap === 'round' ? center : 0},${center}
           L ${strokeLinecap === 'round' ? right : 100},${center}`;
    const viewBoxString = `0 0 100 ${strokeWidth}`;

    const pathFirst = {
      attrs: {
        d: pathString,
        'stroke-linecap': strokeLinecap,
        stroke: trailColor,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0',
      },
      class: `${prefixCls}-line-trail`,
    };
    const pathSecond = {
      attrs: {
        d: pathString,
        'stroke-linecap': strokeLinecap,
        stroke: strokeColor,
        'stroke-width': strokeWidth,
        'fill-opacity': '0',
      },
      class: `${prefixCls}-line-path`,
      style: pathStyle,
      ref: 'svgPathRef',
    };
    return (
      <svg
        class={`${prefixCls}-line`}
        viewBox={viewBoxString}
        preserveAspectRatio="none"
        {...restProps}
      >
        <path {...pathFirst} />
        <path {...pathSecond} />
      </svg>
    );
  },
};

export default enhancer(Line);
