import { defineComponent } from 'vue';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

const Line = defineComponent({
  name: 'Line',
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
      transition,
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
      d: pathString,
      'stroke-linecap': strokeLinecap,
      stroke: trailColor,
      'stroke-width': trailWidth || strokeWidth,
      'fill-opacity': '0',
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
              transition ||
              'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear',
          };
          const color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];

          stackPtg += ptg;

          const pathProps = {
            key: index,
            d: pathString,
            'stroke-linecap': strokeLinecap,
            stroke: color,
            'stroke-width': strokeWidth,
            'fill-opacity': '0',
            class: `${prefixCls}-line-path`,
            style: pathStyle,
          };

          return <path ref={c => (this.paths[index] = c)} {...pathProps} />;
        })}
      </svg>
    );
  },
});

export default enhancer(Line);
