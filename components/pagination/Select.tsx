import { defineComponent } from 'vue';
import VcSelect, { selectProps } from '../select';

export default defineComponent({
  name: 'MiniSelect',
  compatConfig: { MODE: 3 },
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

export const MiddleSelect = defineComponent({
  name: 'MiddleSelect',
  inheritAttrs: false,
  props: selectProps(),
  Option: VcSelect.Option,
  setup(props, { attrs, slots }) {
    return () => {
      const selelctProps: any = {
        ...props,
        size: 'middle',
        ...attrs,
      };
      return <VcSelect {...selelctProps} v-slots={slots}></VcSelect>;
    };
  },
});
