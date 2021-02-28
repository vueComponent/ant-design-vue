import Checkbox from '../checkbox';
import Radio from '../radio';
import { SelectionBoxProps } from './interface';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, getListeners } from '../_util/props-util';

export default {
  name: 'SelectionBox',
  mixins: [BaseMixin],
  props: SelectionBoxProps,
  computed: {
    checked() {
      const { store, defaultSelection, rowIndex } = this.$props;
      let checked = false;
      if (store.selectionDirty) {
        checked = store.selectedRowKeys.indexOf(rowIndex) >= 0;
      } else {
        checked =
          store.selectedRowKeys.indexOf(rowIndex) >= 0 || defaultSelection.indexOf(rowIndex) >= 0;
      }
      return checked;
    },
  },
  render() {
    const { type, rowIndex, ...rest } = getOptionProps(this);
    const { checked } = this;
    const checkboxProps = {
      props: {
        checked,
        ...rest,
      },
      on: getListeners(this),
    };
    if (type === 'radio') {
      checkboxProps.props.value = rowIndex;
      return <Radio {...checkboxProps} />;
    }
    return <Checkbox {...checkboxProps} />;
  },
};
