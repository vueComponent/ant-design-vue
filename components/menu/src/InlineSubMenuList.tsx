import { computed, defineComponent, ref, watch } from '@vue/runtime-core';
import { useInjectMenu, MenuContextProvider } from './hooks/useMenuContext';
import { MenuMode } from './interface';
import SubMenuList from './SubMenuList';
export default defineComponent({
  name: 'InlineSubMenuList',
  inheritAttrs: false,
  props: {
    id: String,
    open: Boolean,
    keyPath: Array,
  },
  setup(props, { slots }) {
    const fixedMode: MenuMode = 'inline';
    const { prefixCls, forceSubMenuRender, motion, mode } = useInjectMenu();
    const sameModeRef = computed(() => mode.value === fixedMode);
    const destroy = ref(!sameModeRef.value);

    // ================================= Effect =================================
    // Reset destroy state when mode change back
    watch(
      mode,
      () => {
        if (sameModeRef.value) {
          destroy.value = false;
        }
      },
      { flush: 'post' },
    );
    let transitionProps = computed(() => {
      return { appear: props.keyPath.length > 1, css: false };
    });

    return () => {
      if (destroy.value) {
        return null;
      }
      return (
        <MenuContextProvider
          props={{
            mode: fixedMode,
            locked: !sameModeRef.value,
          }}
        >
          <SubMenuList id={props.id}>{slots.default?.()}</SubMenuList>
        </MenuContextProvider>
      );
    };
  },
});
