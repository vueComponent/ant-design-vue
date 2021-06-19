import { defineComponent } from 'vue';
import { useInjectMenu } from './hooks/useMenuContext';

export default defineComponent({
  name: 'AMenuDivider',
  setup() {
    const { prefixCls } = useInjectMenu();
    return () => {
      return <li class={`${prefixCls.value}-item-divider`} />;
    };
  },
});
