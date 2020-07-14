import VcSelect, { SelectProps } from '../select';
import { getOptionProps, getSlot } from '../_util/props-util';

export default {
  inheritAttrs: false,
  props: {
    ...SelectProps,
  },
  Option: VcSelect.Option,
  render() {
    const selectOptionsProps = getOptionProps(this);
    const selelctProps = {
      ...selectOptionsProps,
      size: 'small',
      ...this.$attrs,
    };
    return <VcSelect {...selelctProps}>{getSlot(this)}</VcSelect>;
  },
};
