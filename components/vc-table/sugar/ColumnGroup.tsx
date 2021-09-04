import type { ColumnType } from '../interface';
import type { FunctionalComponent } from 'vue';
/* istanbul ignore next */
/**
 * This is a syntactic sugar for `columns` prop.
 * So HOC will not work on this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ColumnGroupProps<RecordType> = ColumnType<RecordType>;

const ColumnGroup: { <T>(arg: T): FunctionalComponent<ColumnGroupProps<T>> } = () => null;

export default ColumnGroup;
