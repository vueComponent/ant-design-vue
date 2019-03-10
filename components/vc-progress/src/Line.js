import Vue from 'vue';
import ref from 'vue-ref';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

Vue.use(ref, { name: 'ant-ref' });

const Line = {
  props: initDefaultProps(propTypes, defaultProps),
  created() {
    this.paths = {};
  },
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

    const percentList = Array.isArray(percent) ? percent : [percent];
    const strokeColorList = Array.isArray(strokeColor) ? strokeColor : [strokeColor];

    const center = strokeWidth / 2;
    const right = 100 - strokeWidth / 2;
    const pathString = `M ${strokeLinecap === 'round' ? center : 0},${center}
           L ${strokeLinecap === 'round' ? right : 100},${center}`;
    const viewBoxString = `0 0 100 ${strokeWidth}`;

    let stackPtg = 0;

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
    return (
      <svg
        class={`${prefixCls}-line`}
        viewBox={viewBoxString}
        preserveAspectRatio="none"
        {...restProps}
      >
        <path {...pathFirst} />
        {percentList.map((ptg, index) => {
          const pathStyle = {
            strokeDasharray: `${ptg}px, 100px`,
            strokeDashoffset: `-${stackPtg}px`,
            transition:
              'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear',
          };
          const color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];

          stackPtg += ptg;

          const pathProps = {
            key: index,
            attrs: {
              d: pathString,
              'stroke-linecap': strokeLinecap,
              stroke: color,
              'stroke-width': strokeWidth,
              'fill-opacity': '0',
            },
            class: `${prefixCls}-line-path`,
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
        })}
      </svg>
    );
  },
};

export default enhancer(Line);
