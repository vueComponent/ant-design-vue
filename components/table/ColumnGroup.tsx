import { defineComponent } from 'vue';
import type { ColumnGroupProps } from '../vc-table/sugar/ColumnGroup';

export default defineComponent<ColumnGroupProps<any>>({
  name: 'ATableColumnGroup',
  slots: ['title'],
  __ANT_TABLE_COLUMN_GROUP: true,
  render() {
    return null;
  },
});
