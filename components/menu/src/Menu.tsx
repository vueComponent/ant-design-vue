import { Key } from '../../_util/type';
import { computed, defineComponent, ExtractPropTypes, ref, PropType } from 'vue';
import useProvideMenu from './hooks/useMenuContext';
import useConfigInject from '../../_util/hooks/useConfigInject';
import { MenuTheme, MenuMode } from './interface';

export const menuProps = {
  prefixCls: String,
  disabled: Boolean,
  theme: { type: String as PropType<MenuTheme>, default: 'light' },
  mode: { type: String as PropType<MenuMode>, default: 'vertical' },
};

export type MenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

export default defineComponent({
  name: 'AMenu',
  props: menuProps,
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('menu', props);
    const activeKeys = ref([]);
    const openKeys = ref([]);
    const selectedKeys = ref([]);
    const changeActiveKeys = (keys: Key[]) => {
      activeKeys.value = keys;
    };
    const disabled = computed(() => !!props.disabled);
    useProvideMenu({ prefixCls, activeKeys, openKeys, selectedKeys, changeActiveKeys, disabled });
    const isRtl = computed(() => direction.value === 'rtl');
    const mergedMode = ref('vertical');
    const mergedInlineCollapsed = ref(false);
    const className = computed(() => {
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-root`]: true,
        [`${prefixCls.value}-${mergedMode.value}`]: true,
        [`${prefixCls.value}-inline-collapsed`]: mergedInlineCollapsed.value,
        [`${prefixCls.value}-rtl`]: isRtl.value,
        [`${prefixCls.value}-${props.theme}`]: true,
      };
    });
    return () => {
      return <ul class={className.value}>{slots.default?.()}</ul>;
    };
  },
});
