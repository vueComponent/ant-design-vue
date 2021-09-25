import { defineComponent } from 'vue';
import VcSelect, { selectProps } from '../select';

export default defineComponent({
  inheritAttrs: false,
  props: selectProps(),
  Option: VcSelect.Option,
  setup(props, { attrs, slots }) {
    return () => {
      const selelctProps: any = {
        ...props,
        size: 'small',
        ...attrs,
      };
      return <VcSelect {...selelctProps} v-slots={slots}></VcSelect>;
    };
  },
});
