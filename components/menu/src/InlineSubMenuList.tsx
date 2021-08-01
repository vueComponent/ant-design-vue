import { computed, defineComponent, ref, watch } from 'vue';
import Transition from '../../_util/transition';
import { useInjectMenu, MenuContextProvider } from './hooks/useMenuContext';
import type { MenuMode } from './interface';
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
    const fixedMode = computed<MenuMode>(() => 'inline');
    const { motion, mode, defaultMotions } = useInjectMenu();
    const sameModeRef = computed(() => mode.value === fixedMode.value);
    const destroy = ref(!sameModeRef.value);

    const mergedOpen = computed(() => (sameModeRef.value ? props.open : false));

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
    const style = ref({});
    const className = ref('');
    const mergedMotion = computed(() => {
      const m =
        motion.value || defaultMotions.value?.[fixedMode.value] || defaultMotions.value?.other;
      const res = typeof m === 'function' ? m(style, className) : m;
      return { ...res, appear: props.keyPath.length <= 1 };
    });
    return () => {
      if (destroy.value) {
        return null;
      }
      return (
        <MenuContextProvider mode={fixedMode.value}>
          <Transition {...mergedMotion.value}>
            <SubMenuList
              v-show={mergedOpen.value}
              id={props.id}
              style={style.value}
              class={className.value}
            >
              {slots.default?.()}
            </SubMenuList>
          </Transition>
        </MenuContextProvider>
      );
    };
  },
});
