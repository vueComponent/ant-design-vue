import { defineComponent } from 'vue';
import type { ColumnGroupProps } from '../vc-table/sugar/ColumnGroup';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent<ColumnGroupProps<any>>({
  name: 'ATableColumnGroup',
  slots: Object as CustomSlotsType<{
    title?: any;
    default?: any;
  }>,
  __ANT_TABLE_COLUMN_GROUP: true,
  render() {
    return null;
  },
});
