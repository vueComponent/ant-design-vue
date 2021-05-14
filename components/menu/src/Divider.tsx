import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Divider',
  props: {
    prefixCls: String,
  },
  setup(props) {
    return () => {
      return <li class={`${props.prefixCls}-item-divider`} />;
    };
  },
});
