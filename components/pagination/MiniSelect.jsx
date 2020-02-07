import VcSelect, { SelectProps } from '../select';
import { getOptionProps, filterEmpty, getListeners } from '../_util/props-util';

export default {
  props: {
    ...SelectProps,
  },
  Option: VcSelect.Option,
  render() {
    const selectOptionsProps = getOptionProps(this);
    const selelctProps = {
      props: {
        ...selectOptionsProps,
        size: 'small',
      },
      on: getListeners(this),
    };
    return <VcSelect {...selelctProps}>{filterEmpty(this.$slots.default)}</VcSelect>;
  },
};
