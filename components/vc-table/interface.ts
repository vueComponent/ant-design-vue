/**
 * ColumnType which applied in antd: https://ant.design/components/table-cn/#column
 * - defaultSortOrder
 * - filterDropdown
 * - filterDropdownOpen
 * - filtered
 * - filteredValue
 * - filterIcon
 * - filterMultiple
 * - filters
 * - sorter
 * - sortOrder
 * - sortDirections
 * - onFilter
 * - onFilterDropdownOpenChange
 */

import type { CSSProperties, Ref, TdHTMLAttributes } from 'vue';

export type Key = number | string;

export type FixedType = 'left' | 'right' | boolean;

export type DefaultRecordType = any;

export type TableLayout = 'auto' | 'fixed';

// ==================== Row =====================
export type RowClassName<RecordType> = (
  record: RecordType,
  index: number,
  indent: number,
) => string;

export type TransformCellText<RecordType> = (opt: {
  text: any;
  column: ColumnType<RecordType>;
  record: any;
  index: number;
}) => any;

// =================== Column ===================
export interface CellType<RecordType = DefaultRecordType> {
  key?: Key;
  class?: string;
  style?: CSSProperties;
  // children?: any;
  column?: ColumnsType<RecordType>[number];
  colSpan?: number;
  rowSpan?: number;

  /** Only used for table header */
  hasSubColumns?: boolean;
  colStart?: number;
  colEnd?: number;
}

export interface RenderedCell<RecordType> {
  props?: CellType<RecordType>;
  children?: any;
}

export type DataIndex = string | number | readonly (string | number)[];

export type CellEllipsisType = { showTitle?: boolean } | boolean;

interface ColumnSharedType<RecordType> {
  title?: any;
  key?: Key;
  class?: string;
  className?: string;
  fixed?: FixedType;
  customHeaderCell?: GetComponentProps<ColumnsType<RecordType>[number]>;
  ellipsis?: CellEllipsisType;
  align?: AlignType;

  customFilterDropdown?: boolean;

  /** @deprecated Please use `v-slot:filterIcon` `v-slot:bodyCell` `v-slot:headerCell` instead */
  slots?: {
    filterIcon?: string;
    filterDropdown?: string;
    customRender?: string;
    title?: string;
  };

  /**
   * @private Internal usage.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  __originColumn__?: any;
}

export interface ColumnGroupType<RecordType> extends ColumnSharedType<RecordType> {
  children: ColumnsType<RecordType>;
}

export type AlignType = 'left' | 'center' | 'right';

export interface ColumnType<RecordType> extends ColumnSharedType<RecordType> {
  colSpan?: number;
  dataIndex?: DataIndex;
  customRender?: (opt: {
    value: any;
    text: any; // 兼容 V2
    record: RecordType;
    index: number;
    renderIndex: number;
    column: ColumnType<RecordType>;
  }) => any | RenderedCell<RecordType>;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  customCell?: GetComponentProps<RecordType>;
  /** @deprecated Please use `customCell` instead */
  onCellClick?: (record: RecordType, e: MouseEvent) => void;
}

export type ColumnsType<RecordType = unknown> = readonly (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

export type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;

// ================= Fix Column =================
export interface StickyOffsets {
  left: readonly number[];
  right: readonly number[];
  isSticky?: boolean;
}
export type AdditionalProps = TdHTMLAttributes & {
  colSpan?: number;
  rowSpan?: number;
};
// ================= Customized =================
export type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
  column?: ColumnType<any>,
) => AdditionalProps;

// type Component<P> = DefineComponent<P> | FunctionalComponent<P> | string;

export type CustomizeComponent = any;

export type CustomizeScrollBody<RecordType> = (
  data: readonly RecordType[],
  info: {
    scrollbarSize: number;
    ref: Ref<{ scrollLeft: number }>;
    onScroll: (info: { currentTarget?: HTMLElement; scrollLeft?: number }) => void;
  },
) => any;

export interface TableComponents<RecordType> {
  table?: CustomizeComponent;
  header?: {
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
  };
  body?:
    | CustomizeScrollBody<RecordType>
    | {
        wrapper?: CustomizeComponent;
        row?: CustomizeComponent;
        cell?: CustomizeComponent;
      };
}

export type GetComponent = (
  path: readonly string[],
  defaultComponent?: CustomizeComponent,
) => CustomizeComponent;

// =================== Expand ===================
export type ExpandableType = false | 'row' | 'nest';

export interface LegacyExpandableProps<RecordType> {
  expandedRowKeys?: Key[];

  defaultExpandedRowKeys?: Key[];

  expandedRowRender?: ExpandedRowRender<RecordType>;

  expandRowByClick?: boolean;

  expandIcon?: RenderExpandIcon<RecordType>;

  onExpand?: (expanded: boolean, record: RecordType) => void;

  onExpandedRowsChange?: (expandedKeys: Key[]) => void;

  defaultExpandAllRows?: boolean;

  indentSize?: number;
  /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
  expandIconColumnIndex?: number;

  showExpandColumn?: boolean;

  expandedRowClassName?: RowClassName<RecordType>;

  childrenColumnName?: string;

  rowExpandable?: (record: RecordType) => boolean;
}

export type ExpandedRowRender<ValueType> = (opt: {
  record: ValueType;
  index: number;
  indent: number;
  expanded: boolean;
}) => any;

export interface RenderExpandIconProps<RecordType> {
  prefixCls: string;
  expanded: boolean;
  record: RecordType;
  expandable: boolean;
  onExpand: TriggerEventHandler<RecordType>;
}

export type RenderExpandIcon<RecordType> = (props: RenderExpandIconProps<RecordType>) => any;

export interface ExpandableConfig<RecordType> {
  expandedRowKeys?: readonly Key[];
  defaultExpandedRowKeys?: readonly Key[];
  expandedRowRender?: ExpandedRowRender<RecordType>;
  expandRowByClick?: boolean;
  expandIcon?: RenderExpandIcon<RecordType>;
  onExpand?: (expanded: boolean, record: RecordType) => void;
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void;
  defaultExpandAllRows?: boolean;
  indentSize?: number;
  /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
  expandIconColumnIndex?: number;
  showExpandColumn?: boolean;
  expandedRowClassName?: RowClassName<RecordType>;
  childrenColumnName?: string;
  rowExpandable?: (record: RecordType) => boolean;
  columnWidth?: number | string;
  fixed?: FixedType;
}

// =================== Render ===================
export type PanelRender<RecordType> = (data: readonly RecordType[]) => any;

// =================== Events ===================
export type TriggerEventHandler<RecordType> = (record: RecordType, event: MouseEvent) => void;

// =================== Sticky ===================
export interface TableSticky {
  offsetHeader?: number;
  offsetSummary?: number;
  offsetScroll?: number;
  getContainer?: () => Window | HTMLElement;
}
