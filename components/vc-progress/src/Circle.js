import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

const circlePropTypes = {
  ...propTypes,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  gapDegree: PropTypes.number,
};

const circleDefaultProps = {
  ...defaultProps,
  gapPosition: 'top',
};

const Circle = {
  props: initDefaultProps(circlePropTypes, circleDefaultProps),
  methods: {
    getPathStyles() {
      const { percent, strokeWidth, strokeColor, gapDegree = 0, gapPosition } = this.$props;
      const radius = 50 - strokeWidth / 2;
      let beginPositionX = 0;
      let beginPositionY = -radius;
      let endPositionX = 0;
      let endPositionY = -2 * radius;
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
      const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
       a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
       a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
      const len = Math.PI * 2 * radius;
      const trailPathStyle = {
        strokeDasharray: `${len - gapDegree}px ${len}px`,
        strokeDashoffset: `-${gapDegree / 2}px`,
        transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s',
      };
      const strokePathStyle = {
        stroke: strokeColor,
        strokeDasharray: `${(percent / 100) * (len - gapDegree)}px ${len}px`,
        strokeDashoffset: `-${gapDegree / 2}px`,
        transition:
          'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s', // eslint-disable-line
      };
      return { pathString, trailPathStyle, strokePathStyle };
    },
  },
  render() {
    const {
      prefixCls,
      strokeWidth,
      trailWidth,
      trailColor,
      strokeLinecap,
      percent,
      ...restProps
    } = this.$props;
    const { pathString, trailPathStyle, strokePathStyle } = this.getPathStyles();
    delete restProps.percent;
    delete restProps.gapDegree;
    delete restProps.gapPosition;
    delete restProps.strokeColor;
    const pathFirst = {
      attrs: {
        d: pathString,
        stroke: trailColor,
        'stroke-linecap': strokeLinecap,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0',
      },
      class: `${prefixCls}-circle-trail`,
      style: trailPathStyle,
    };
    const pathSecond = {
      attrs: {
        d: pathString,
        'stroke-linecap': strokeLinecap,
        'stroke-width': percent === 0 ? 0 : strokeWidth,
        'fill-opacity': '0',
      },
      class: `${prefixCls}-circle-path`,
      style: strokePathStyle,
      ref: 'svgPathRef',
    };
    return (
      <svg class={`${prefixCls}-circle`} viewBox="0 0 100 100" {...restProps}>
        <path {...pathFirst} />
        <path {...pathSecond} />
      </svg>
    );
  },
};

export default enhancer(Circle);
