import { defineComponent } from 'vue';
import VcSelect, { selectProps } from '../select';
import { getOptionProps, getSlot } from '../_util/props-util';

export default defineComponent({
  inheritAttrs: false,
  props: selectProps(),
  Option: VcSelect.Option,
  render() {
    const selectOptionsProps = getOptionProps(this);
    const selelctProps: any = {
      ...selectOptionsProps,
      size: 'small',
      ...this.$attrs,
    };
    return <VcSelect {...selelctProps}>{getSlot(this)}</VcSelect>;
  },
});
