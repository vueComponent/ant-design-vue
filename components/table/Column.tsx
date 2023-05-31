import { defineComponent } from 'vue';
import type { ColumnType } from './interface';
import type { CustomSlotsType } from '../_util/type';

export type ColumnProps<RecordType = unknown> = ColumnType<RecordType>;
export default defineComponent<ColumnProps>({
  name: 'ATableColumn',
  slots: Object as CustomSlotsType<{
    title?: any;
    filterIcon?: any;
    default?: any;
  }>,

  render() {
    return null;
  },
});
