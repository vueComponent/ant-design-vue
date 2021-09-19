import type { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import { computed, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import type { ProgressSize } from './props';
import { progressProps } from './props';

const stepsProps = {
  ...progressProps(),
  steps: PropTypes.number,
  size: {
    type: String as PropType<ProgressSize>,
  },
  strokeColor: PropTypes.string,
  trailColor: PropTypes.string,
};

export type StepsProps = Partial<ExtractPropTypes<typeof stepsProps>>;

export default defineComponent({
  props: stepsProps,
  setup(props, { slots }) {
    const current = computed(() => Math.round(props.steps * ((props.percent || 0) / 100)));
    const stepWidth = computed(() => (props.size === 'small' ? 2 : 14));

    const styledSteps = computed(() => {
      const { steps, strokeWidth = 8, strokeColor, trailColor, prefixCls } = props;

      const temp: VNodeChild[] = [];
      for (let i = 0; i < steps; i += 1) {
        const cls = {
          [`${prefixCls}-steps-item`]: true,
          [`${prefixCls}-steps-item-active`]: i <= current.value - 1,
        };
        temp.push(
          <div
            key={i}
            class={cls}
            style={{
              backgroundColor: i <= current.value - 1 ? strokeColor : trailColor,
              width: `${stepWidth.value}px`,
              height: `${strokeWidth}px`,
            }}
          />,
        );
      }
      return temp;
    });

    return () => (
      <div class={`${props.prefixCls}-steps-outer`}>
        {styledSteps.value}
        {slots.default?.()}
      </div>
    );
  },
});
