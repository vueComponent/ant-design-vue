import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import type { SizeType } from '../config-provider';
import type { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
import useConfigInject from '../_util/hooks/useConfigInject';

export default defineComponent({
  name: 'AInputGroup',
  props: {
    prefixCls: PropTypes.string,
    size: { type: String as PropType<SizeType> },
    compact: PropTypes.looseBool,
    onMouseenter: { type: Function as PropType<MouseEventHandler> },
    onMouseleave: { type: Function as PropType<MouseEventHandler> },
    onFocus: { type: Function as PropType<FocusEventHandler> },
    onBlur: { type: Function as PropType<FocusEventHandler> },
  },
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('input-group', props);
    const cls = computed(() => {
      const pre = prefixCls.value;
      return {
        [`${pre}`]: true,
        [`${pre}-lg`]: props.size === 'large',
        [`${pre}-sm`]: props.size === 'small',
        [`${pre}-compact`]: props.compact,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
    });
    return () => {
      return (
        <span
          class={cls.value}
          onMouseenter={props.onMouseEnter}
          onMouseleave={props.onMouseLeave}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        >
          {slots.default?.()}
        </span>
      );
    };
  },
});
