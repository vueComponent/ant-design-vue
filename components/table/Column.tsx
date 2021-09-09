import { defineComponent } from 'vue';
import type { ColumnType } from './interface';

export type ColumnProps<RecordType = unknown> = ColumnType<RecordType>;
export default defineComponent<ColumnProps>({
  name: 'ATableColumn',
  slots: ['title', 'filterIcon'],
  render() {
    return null;
  },
});
