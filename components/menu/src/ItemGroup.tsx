import { getPropsSlot } from '../../_util/props-util';
import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';
import { useInjectMenu } from './hooks/useMenuContext';

const menuItemGroupProps = {
  title: PropTypes.VNodeChild,
};

export type MenuItemGroupProps = Partial<ExtractPropTypes<typeof menuItemGroupProps>>;

export default defineComponent({
  name: 'AMenuItemGroup',
  inheritAttrs: false,
  props: menuItemGroupProps,
  slots: ['title'],
  setup(props, { slots, attrs }) {
    const { prefixCls } = useInjectMenu();
    const groupPrefixCls = computed(() => `${prefixCls.value}-item-group`);
    return () => {
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
