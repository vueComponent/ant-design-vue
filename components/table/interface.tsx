import type {
  GetRowKey,
  ColumnType as RcColumnType,
  RenderedCell as RcRenderedCell,
  ExpandableConfig,
  DefaultRecordType,
  FixedType,
} from '../vc-table/interface';
import type { TooltipProps } from '../tooltip';
import type { CheckboxProps } from '../checkbox';
import type { PaginationProps } from '../pagination';
import type { Breakpoint } from '../_util/responsiveObserve';
import type { INTERNAL_SELECTION_ITEM } from './hooks/useSelection';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';
import type { CSSProperties, VNodeArrayChildren } from 'vue';
// import { TableAction } from './Table';

export type { GetRowKey, ExpandableConfig };

export type Key = string | number;

export type RowSelectionType = 'checkbox' | 'radio';

export type SelectionItemSelectFn = (currentRowKeys: Key[]) => void;

export type ExpandType = null | 'row' | 'nest';

export interface TableLocale {
  filterTitle?: string;
  filterConfirm?: any;
  filterReset?: any;
  filterEmptyText?: any;
  filterCheckall?: any;
  filterSearchPlaceholder?: any;
  emptyText?: any | (() => any);
  selectAll?: any;
  selectNone?: any;
  selectInvert?: any;
  selectionAll?: any;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
}

export type SortOrder = 'descend' | 'ascend' | null;

const TableActions = tuple('paginate', 'sort', 'filter');
export type TableAction = (typeof TableActions)[number];

export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;

export interface ColumnFilterItem {
  text: VueNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
}
export interface ColumnTitleProps<RecordType> {
  /** @deprecated Please use `sorterColumns` instead. */
  sortOrder?: SortOrder;
  /** @deprecated Please use `sorterColumns` instead. */
  sortColumn?: ColumnType<RecordType>;
  sortColumns?: { column: ColumnType<RecordType>; order: SortOrder }[];

  filters?: Record<string, FilterValue>;
}

type ColumnTitleNode = VueNode | VNodeArrayChildren;
export type ColumnTitle<RecordType> =
  | ColumnTitleNode
  | ((props: ColumnTitleProps<RecordType>) => ColumnTitleNode);

export type FilterValue = (Key | boolean)[];
export type FilterKey = Key[] | null;
export type FilterSearchType<RecordType = Record<string, any>> =
  | boolean
  | ((input: string, record: RecordType) => boolean);
export interface FilterConfirmProps {
  closeDropdown: boolean;
}
export interface FilterResetProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}

export interface FilterDropdownProps<RecordType> {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: Key[]) => void;
  selectedKeys: Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: (param?: FilterResetProps) => void;
  filters?: ColumnFilterItem[];
  /** Only close filterDropdown */
  close: () => void;
  visible: boolean;
  column: ColumnType<RecordType>;
}

export interface ColumnType<RecordType = DefaultRecordType>
  extends Omit<RcColumnType<RecordType>, 'title'> {
  title?: ColumnTitle<RecordType>;
  // Sorter
  sorter?:
    | boolean
    | CompareFn<RecordType>
    | {
        compare?: CompareFn<RecordType>;
        /** Config multiple sorter order priority */
        multiple?: number;
      };
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | TooltipProps;

  // Filter
  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?: VueNode | ((props: FilterDropdownProps<RecordType>) => VueNode);
  filterMultiple?: boolean;
  filteredValue?: FilterValue | null;
  defaultFilteredValue?: FilterValue | null;
  filterIcon?: VueNode | ((opt: { filtered: boolean; column: ColumnType }) => VueNode);
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem>;
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
  filterDropdownOpen?: boolean;
  onFilterDropdownOpenChange?: (visible: boolean) => void;
  filterResetToDefaultFilteredValue?: boolean;
  // Responsive
  responsive?: Breakpoint[];

  // Deprecated
  /** @deprecated Please use `filterDropdownOpen` instead */
  filterDropdownVisible?: boolean;
  /** @deprecated Please use `onFilterDropdownOpenChange` instead */
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
}

export interface ColumnGroupType<RecordType> extends Omit<ColumnType<RecordType>, 'dataIndex'> {
  children: ColumnsType<RecordType>;
}

export type ColumnsType<RecordType = DefaultRecordType> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

export interface SelectionItem {
  key: string;
  text: VueNode;
  onSelect?: SelectionItemSelectFn;
}

export type SelectionSelectFn<T> = (
  record: T,
  selected: boolean,
  selectedRows: T[],
  nativeEvent: Event,
) => void;

export interface TableRowSelection<T = DefaultRecordType> {
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean;
  type?: RowSelectionType;
  selectedRowKeys?: Key[];
  defaultSelectedRowKeys?: Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>;
  onSelect?: SelectionSelectFn<T>;
  onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated This function is meaningless and should use `onChange` instead */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated This function is meaningless and should use `onChange` instead */
  onSelectInvert?: (selectedRowKeys: Key[]) => void;
  onSelectNone?: () => void;
  selections?: INTERNAL_SELECTION_ITEM[] | boolean;
  hideSelectAll?: boolean;
  fixed?: FixedType;
  columnWidth?: string | number;
  columnTitle?: string | VueNode;
  checkStrictly?: boolean;
  renderCell?: (
    value: boolean,
    record: T,
    index: number,
    originNode: VueNode,
  ) => VueNode | RcRenderedCell<T>;
}

export type TransformColumns<RecordType> = (
  columns: ColumnsType<RecordType>,
) => ColumnsType<RecordType>;

export interface TableCurrentDataSource<RecordType = DefaultRecordType> {
  currentDataSource: RecordType[];
  action: TableAction;
}

export interface SorterResult<RecordType = DefaultRecordType> {
  column?: ColumnType<RecordType>;
  order?: SortOrder;
  field?: Key | readonly Key[];
  columnKey?: Key;
}

export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;

type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

export interface TablePaginationConfig extends PaginationProps {
  position?: TablePaginationPosition[];
  class?: string;
  style?: CSSProperties;
}

export interface TransformCellTextProps {
  text: any;
  column: ColumnType;
  record: any;
  index: number;
}
