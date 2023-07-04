import type {
  ColumnType,
  DefaultRecordType,
  ColumnsType,
  TableLayout,
  RenderExpandIcon,
  ExpandableType,
  RowClassName,
  TriggerEventHandler,
  ExpandedRowRender,
} from '../interface';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

export interface BodyContextProps<RecordType = DefaultRecordType> {
  rowClassName: string | RowClassName<RecordType>;
  expandedRowClassName: RowClassName<RecordType>;

  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[];

  tableLayout: TableLayout;

  indentSize: number;
  expandableType: ExpandableType;
  expandRowByClick: boolean;
  expandedRowRender: ExpandedRowRender<RecordType>;
  expandIcon: RenderExpandIcon<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  expandIconColumnIndex: number;
}
export const BodyContextKey: InjectionKey<BodyContextProps> = Symbol('BodyContextProps');

export const useProvideBody = (props: BodyContextProps) => {
  provide(BodyContextKey, props);
};

export const useInjectBody = () => {
  return inject(BodyContextKey, {} as BodyContextProps);
};
