import type { ExtractPropTypes } from 'vue';
import { defineComponent, computed } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

export const cardGridProps = () => ({
  prefixCls: String,
  hoverable: { type: Boolean, default: true },
});
export type CardGridProps = Partial<ExtractPropTypes<ReturnType<typeof cardGridProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACardGrid',
  inheritAttrs: false,
  __ANT_CARD_GRID: true,
  props: cardGridProps(),
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('card', props);
    const [wrapSSR, hashId] = useStyle(prefixCls); //安装style
    const classNames = computed(() => {
      return {
        [`${prefixCls.value}-grid`]: true,
        [`${prefixCls.value}-grid-hoverable`]: props.hoverable,
      };
    });
    return wrapSSR(<div class={[classNames.value, hashId.value]}>{slots.default?.()}</div>);
  },
});
