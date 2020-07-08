import VcSelect, { SelectProps } from '../select';
import { getOptionProps, filterEmpty } from '../_util/props-util';

export default {
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
    return <VcSelect {...selelctProps}>{filterEmpty(this.$slots.default?.())}</VcSelect>;
  },
};
