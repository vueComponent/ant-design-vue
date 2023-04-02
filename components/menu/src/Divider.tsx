import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import { useInjectMenu } from './hooks/useMenuContext';

export const menuDividerProps = () => ({
  prefixCls: String,
  dashed: Boolean,
});

export type MenuDividerProps = Partial<ExtractPropTypes<ReturnType<typeof menuDividerProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AMenuDivider',
  props: menuDividerProps(),
  setup(props) {
    const { prefixCls } = useInjectMenu();
    const cls = computed(() => {
      return {
        [`${prefixCls.value}-item-divider`]: true,
        [`${prefixCls.value}-item-divider-dashed`]: !!props.dashed,
      };
    });
    return () => {
      return <li class={cls.value} />;
    };
  },
});
