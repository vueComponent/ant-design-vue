import type { FunctionalComponent } from 'vue';
import type { ColumnType } from '../interface';

export type ColumnProps<RecordType> = ColumnType<RecordType>;

/* istanbul ignore next */
/**
 * This is a syntactic sugar for `columns` prop.
 * So HOC will not work on this.
 */
const Column: { <T>(arg: T): FunctionalComponent<ColumnProps<T>> } = () => null;

export default Column;
