import { defineComponent } from 'vue';
import { ColumnType } from './interface';

export type ColumnProps = ColumnType;
export default defineComponent<ColumnProps>({
  name: 'ATableColumn',
  slots: ['title', 'filterIcon'],
  render() {
    return null;
  },
});
