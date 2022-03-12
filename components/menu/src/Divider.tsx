import useConfigInject from '../../_util/hooks/useConfigInject';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'AMenuDivider',
  props: {
    prefixCls: String,
    dashed: Boolean,
  },
  setup(props) {
    const { prefixCls } = useConfigInject('menu', props);
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
