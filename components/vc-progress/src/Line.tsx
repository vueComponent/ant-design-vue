import { computed, defineComponent } from 'vue';
import initDefaultProps from '../../_util/props-util/initDefaultProps';
import { useTransitionDuration, defaultProps } from './common';
import { propTypes } from './types';

export default defineComponent({
  name: 'Line',
  props: initDefaultProps(propTypes, defaultProps),
  setup(props) {
    const percentList = computed(() => {
      const { percent } = props;
      return Array.isArray(percent) ? percent : [percent];
    });

    const strokeColorList = computed(() => {
      const { strokeColor } = props;
      return Array.isArray(strokeColor) ? strokeColor : [strokeColor];
    });

    const paths = useTransitionDuration(percentList);
    const center = computed(() => props.strokeWidth / 2);
    const right = computed(() => 100 - props.strokeWidth / 2);

    const pathString = computed(
      () => `M ${props.strokeLinecap === 'round' ? center.value : 0},${center.value}
    L ${props.strokeLinecap === 'round' ? right.value : 100},${center.value}`,
    );

    const viewBoxString = computed(() => `0 0 100 ${props.strokeWidth}`);

    const pathFirst = computed(() => ({
      d: pathString.value,
      'stroke-linecap': props.strokeLinecap,
      stroke: props.trailColor,
      'stroke-width': props.trailWidth || props.strokeWidth,
      'fill-opacity': '0',
      class: `${props.prefixCls}-line-trail`,
    }));

    return () => {
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
      } = props;

      delete restProps.gapPosition;

      let stackPtg = 0;

      return (
        <svg
          class={`${prefixCls}-line`}
          viewBox={viewBoxString.value}
          preserveAspectRatio="none"
          {...restProps}
        >
          <path {...pathFirst.value} />
          {percentList.value.map((ptg, index) => {
            const pathStyle = {
              strokeDasharray: `${ptg}px, 100px`,
              strokeDashoffset: `-${stackPtg}px`,
              transition:
                transition ||
                'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear',
            };
            const color =
              strokeColorList.value[index] ||
              strokeColorList.value[strokeColorList.value.length - 1];

            stackPtg += ptg;

            const pathProps = {
              key: index,
              d: pathString.value,
              'stroke-linecap': strokeLinecap,
              stroke: color as string,
              'stroke-width': strokeWidth,
              'fill-opacity': '0',
              class: `${prefixCls}-line-path`,
              style: pathStyle,
            };

            return <path ref={c => (paths.value[index].value = c)} {...pathProps} />;
          })}
        </svg>
      );
    };
  },
});
