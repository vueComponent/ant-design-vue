import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';

import { tuple, booleanType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';

export const timelineItemProps = () => ({
  prefixCls: String,
  color: String,
  dot: PropTypes.any,
  pending: booleanType(),
  position: PropTypes.oneOf(tuple('left', 'right', '')).def(''),
  label: PropTypes.any,
});

export type TimelineItemProps = Partial<ExtractPropTypes<ReturnType<typeof timelineItemProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATimelineItem',
  props: initDefaultProps(timelineItemProps(), {
    color: 'blue',
    pending: false,
  }),
  slots: Object as CustomSlotsType<{
    dot?: any;
    label?: any;
    default?: any;
  }>,
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('timeline', props);
    const itemClassName = computed(() => ({
      [`${prefixCls.value}-item`]: true,
      [`${prefixCls.value}-item-pending`]: props.pending,
    }));

    const customColor = computed(() =>
      /blue|red|green|gray/.test(props.color || '') ? undefined : props.color || 'blue',
    );
    const dotClassName = computed(() => ({
      [`${prefixCls.value}-item-head`]: true,
      [`${prefixCls.value}-item-head-${props.color || 'blue'}`]: !customColor.value,
    }));
    return () => {
      const { label = slots.label?.(), dot = slots.dot?.() } = props;
      return (
        <li class={itemClassName.value}>
          {label && <div class={`${prefixCls.value}-item-label`}>{label}</div>}
          <div class={`${prefixCls.value}-item-tail`} />
          <div
            class={[dotClassName.value, !!dot && `${prefixCls.value}-item-head-custom`]}
            style={{ borderColor: customColor.value, color: customColor.value }}
          >
            {dot}
          </div>
          <div class={`${prefixCls.value}-item-content`}>{slots.default?.()}</div>
        </li>
      );
    };
  },
});
