import { defineComponent, computed } from 'vue';
import useConfigInject from '../_util/hooks/useConfigInject';

export default defineComponent({
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: String,
    hoverable: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('card', props);
    const classNames = computed(() => {
      return {
        [`${prefixCls.value}-grid`]: true,
        [`${prefixCls.value}-grid-hoverable`]: props.hoverable,
      };
    });
    return () => {
      return <div class={classNames.value}>{slots.default?.()}</div>;
    };
  },
});
