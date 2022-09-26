import { getPropsSlot } from '../../_util/props-util';
import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';
import { useInjectMenu } from './hooks/useMenuContext';
import { useMeasure } from './hooks/useKeyPath';

export const menuItemGroupProps = () => ({
  title: PropTypes.any,
});

export type MenuItemGroupProps = Partial<ExtractPropTypes<ReturnType<typeof menuItemGroupProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AMenuItemGroup',
  inheritAttrs: false,
  props: menuItemGroupProps(),
  slots: ['title'],
  setup(props, { slots, attrs }) {
    const { prefixCls } = useInjectMenu();
    const groupPrefixCls = computed(() => `${prefixCls.value}-item-group`);
    const isMeasure = useMeasure();
    return () => {
      if (isMeasure) return slots.default?.();
      return (
        <li {...attrs} onClick={e => e.stopPropagation()} class={groupPrefixCls.value}>
          <div
            title={typeof props.title === 'string' ? props.title : undefined}
            class={`${groupPrefixCls.value}-title`}
          >
            {getPropsSlot(slots, props, 'title')}
          </div>
          <ul class={`${groupPrefixCls.value}-list`}>{slots.default?.()}</ul>
        </li>
      );
    };
  },
});
