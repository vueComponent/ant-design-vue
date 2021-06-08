import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AMenuDivider',
  props: {
    prefixCls: String,
  },
  setup(props) {
    return () => {
      return <li class={`${props.prefixCls}-item-divider`} />;
    };
  },
});
