import Vue from 'vue';
import ref from 'vue-ref';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

const circlePropTypes = {
  ...propTypes,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  gapDegree: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
};

const circleDefaultProps = {
  ...defaultProps,
  gapPosition: 'top',
};

Vue.use(ref, { name: 'ant-ref' });

const Circle = {
  props: initDefaultProps(circlePropTypes, circleDefaultProps),
  created() {
    this.paths = {};
  },
  methods: {
    getPathStyles(offset, percent, strokeColor, strokeWidth, gapDegree = 0, gapPosition) {
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
      const pathStyle = {
        stroke: strokeColor,
        strokeDasharray: `${(percent / 100) * (len - gapDegree)}px ${len}px`,
        strokeDashoffset: `-${gapDegree / 2 + (offset / 100) * (len - gapDegree)}px`,
        transition:
          'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s', // eslint-disable-line
      };
      return {
        pathString,
        pathStyle,
      };
    },
    getStokeList() {
      const {
        prefixCls,
        percent,
        strokeColor,
        strokeWidth,
        strokeLinecap,
        gapDegree,
        gapPosition,
      } = this.$props;
      const percentList = Array.isArray(percent) ? percent : [percent];
      const strokeColorList = Array.isArray(strokeColor) ? strokeColor : [strokeColor];

      let stackPtg = 0;
      return percentList.map((ptg, index) => {
        const color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
        const { pathString, pathStyle } = this.getPathStyles(
          stackPtg,
          ptg,
          color,
          strokeWidth,
          gapDegree,
          gapPosition,
        );

        stackPtg += ptg;

        const pathProps = {
          key: index,
          attrs: {
            d: pathString,
            'stroke-linecap': strokeLinecap,
            'stroke-width': ptg === 0 ? 0 : strokeWidth,
            'fill-opacity': '0',
          },
          class: `${prefixCls}-circle-path`,
          style: pathStyle,
          directives: [
            {
              name: 'ant-ref',
              value: c => {
                this.paths[index] = c;
              },
            },
          ],
        };
        return <path {...pathProps} />;
      });
    },
  },

  render() {
    const {
      prefixCls,
      strokeWidth,
      trailWidth,
      gapDegree,
      gapPosition,
      trailColor,
      strokeLinecap,
      ...restProps
    } = this.$props;
    const { pathString, pathStyle } = this.getPathStyles(
      0,
      100,
      trailColor,
      strokeWidth,
      gapDegree,
      gapPosition,
    );
    delete restProps.percent;
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
      style: pathStyle,
    };

    return (
      <svg class={`${prefixCls}-circle`} viewBox="0 0 100 100" {...restProps}>
        <path {...pathFirst} />
        {this.getStokeList()}
      </svg>
    );
  },
};

export default enhancer(Circle);
