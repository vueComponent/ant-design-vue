import type { ExtractPropTypes, PropType, UnwrapRef } from 'vue';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { paginationProps as getPaginationProps, paginationConfig } from '../pagination';
import { getSpinProps } from '../spin';
import { tuple } from '../_util/type';

const PaginationProps = getPaginationProps();

export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;
export const ColumnFilterItem = PropTypes.shape({
  text: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.array,
}).loose;

export const columnProps = {
  title: PropTypes.VNodeChild,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataIndex: PropTypes.string,
  customRender: PropTypes.func,
  customCell: PropTypes.func,
  customHeaderCell: PropTypes.func,
  align: PropTypes.oneOf(tuple('left', 'right', 'center')),
  ellipsis: PropTypes.looseBool,
  filters: PropTypes.arrayOf(ColumnFilterItem),
  onFilter: {
    type: Function as PropType<(value: any, record: any) => boolean>,
  },
  filterMultiple: PropTypes.looseBool,
  filterDropdown: PropTypes.any,
  filterDropdownVisible: PropTypes.looseBool,
  onFilterDropdownVisibleChange: {
    type: Function as PropType<(visible: boolean) => void>,
  },
  sorter: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]),
  defaultSortOrder: PropTypes.oneOf(tuple('ascend', 'descend')),
  colSpan: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  fixed: withUndefined(
    PropTypes.oneOfType([PropTypes.looseBool, PropTypes.oneOf(tuple('left', 'right'))]),
  ),
  filterIcon: PropTypes.any,
  filteredValue: PropTypes.array,
  filtered: PropTypes.looseBool,
  defaultFilteredValue: PropTypes.array,
  sortOrder: withUndefined(
    PropTypes.oneOfType([PropTypes.looseBool, PropTypes.oneOf(tuple('ascend', 'descend'))]),
  ),
  sortDirections: PropTypes.array,
  // children?: ColumnProps<T>[];
  // onCellClick?: (record: T, event: any) => void;
  // onCell?: (record: T) => any;
  // onHeaderCell?: (props: ColumnProps<T>) => any;
};

export type ColumnProps = Partial<ExtractPropTypes<typeof columnProps>> & {
  slots?: {
    title?: string;
    filterIcon?: string;
    filterDropdown?: string;
    customRender?: string;
    [key: string]: string | undefined;
  };
};

export interface TableComponents {
  table?: any;
  header?: {
    wrapper?: any;
    row?: any;
    cell?: any;
  };
  body?: {
    wrapper?: any;
    row?: any;
    cell?: any;
  };
}

export const TableLocale = PropTypes.shape({
  filterTitle: PropTypes.string,
  filterConfirm: PropTypes.any,
  filterReset: PropTypes.any,
  emptyText: PropTypes.any,
  selectAll: PropTypes.any,
  selectInvert: PropTypes.any,
  sortTitle: PropTypes.string,
  expand: PropTypes.string,
  collapse: PropTypes.string,
}).loose;

export const RowSelectionType = PropTypes.oneOf(tuple('checkbox', 'radio'));
// export type SelectionSelectFn<T> = (record: T, selected: boolean, selectedRows: Object[]) => any;

export const tableRowSelection = {
  type: RowSelectionType,
  selectedRowKeys: PropTypes.array,
  // onChange?: (selectedRowKeys: string[] | number[], selectedRows: Object[]) => any;
  getCheckboxProps: PropTypes.func,
  // onSelect?: SelectionSelectFn<T>;
  // onSelectAll?: (selected: boolean, selectedRows: Object[], changeRows: Object[]) => any;
  // onSelectInvert?: (selectedRows: Object[]) => any;
  selections: withUndefined(PropTypes.oneOfType([PropTypes.array, PropTypes.looseBool])),
  hideDefaultSelections: PropTypes.looseBool,
  fixed: PropTypes.looseBool,
  columnWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectWay: PropTypes.oneOf(
    tuple('onSelect', 'onSelectMultiple', 'onSelectAll', 'onSelectInvert'),
  ),
  columnTitle: PropTypes.any,
};

export type SortOrder = 'descend' | 'ascend';

const paginationProps = paginationConfig();

export const tableProps = {
  prefixCls: PropTypes.string,
  dropdownPrefixCls: PropTypes.string,
  rowSelection: PropTypes.oneOfType([PropTypes.shape(tableRowSelection).loose, Object]),
  pagination: withUndefined(
    PropTypes.oneOfType([
      PropTypes.shape<Partial<ExtractPropTypes<typeof paginationProps>>>(paginationProps).loose,
      PropTypes.looseBool,
    ]),
  ),
  size: PropTypes.oneOf(tuple('default', 'middle', 'small', 'large')),
  dataSource: PropTypes.array,
  components: PropTypes.object,
  columns: {
    type: Array as PropType<ColumnProps>,
  },
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowClassName: PropTypes.func,
  expandedRowRender: PropTypes.any,
  defaultExpandAllRows: PropTypes.looseBool,
  defaultExpandedRowKeys: PropTypes.array,
  expandedRowKeys: PropTypes.array,
  expandIconAsCell: PropTypes.looseBool,
  expandIconColumnIndex: PropTypes.number,
  expandRowByClick: PropTypes.looseBool,
  loading: PropTypes.oneOfType([PropTypes.shape(getSpinProps()).loose, PropTypes.looseBool]),
  locale: TableLocale,
  indentSize: PropTypes.number,
  customRow: PropTypes.func,
  customHeaderRow: PropTypes.func,
  useFixedHeader: PropTypes.looseBool,
  bordered: PropTypes.looseBool,
  showHeader: PropTypes.looseBool,
  footer: PropTypes.func,
  title: PropTypes.func,
  scroll: {
    type: Object as PropType<{
      x?: boolean | number | string;
      y?: boolean | number | string;
      scrollToFirstRowOnChange?: boolean;
    }>,
  },
  childrenColumnName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  bodyStyle: PropTypes.style,
  sortDirections: {
    type: Array as PropType<SortOrder[]>,
  },
  tableLayout: PropTypes.string,
  getPopupContainer: PropTypes.func,
  expandIcon: PropTypes.func,
  transformCellText: PropTypes.func,
  onExpandedRowsChange: PropTypes.func,
  onExpand: PropTypes.func,
  onChange: PropTypes.func,
  onRowClick: PropTypes.func,
  // style?: React.CSSProperties;
  // children?: React.ReactNode;
};

export type TableRowSelection = Partial<ExtractPropTypes<typeof tableRowSelection>>;

export type TableProps = Partial<ExtractPropTypes<typeof tableProps>>;

export interface TableStateFilters {
  [key: string]: string[];
}

export interface TableState {
  pagination?: Partial<ExtractPropTypes<typeof PaginationProps>>;
  filters?: TableStateFilters;
  sortColumn?: ColumnProps | null;
  sortOrder?: SortOrder;
  columns?: ColumnProps[];
}

export interface TransformCellTextProps {
  text: any;
  column: ColumnProps;
  record: any;
  index: number;
}

// export type SelectionItemSelectFn = (key: string[]) => any;

// export interface SelectionItem {
//   key: PropTypes.string,
//   text: PropTypes.any,
//   onSelect: SelectionItemSelectFn;
// }
export type TableStore = UnwrapRef<{
  selectedRowKeys: any[];
  selectionDirty: boolean;
}>;
export const SelectionCheckboxAllProps = {
  propsSymbol: PropTypes.any,
  store: PropTypes.any,
  locale: PropTypes.any,
  disabled: PropTypes.looseBool,
  getCheckboxPropsByItem: PropTypes.func,
  getRecordKey: PropTypes.func,
  data: PropTypes.array,
  prefixCls: PropTypes.string,
  hideDefaultSelections: PropTypes.looseBool,
  selections: PropTypes.oneOfType([PropTypes.array, PropTypes.looseBool]),
  getPopupContainer: PropTypes.func,
  onSelect: PropTypes.func,
};

// export interface SelectionCheckboxAllState {
//   checked: PropTypes.looseBool,
//   indeterminate: PropTypes.looseBool,
// }

export const SelectionBoxProps = {
  store: PropTypes.any,
  type: RowSelectionType,
  defaultSelection: PropTypes.array,
  rowIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  disabled: PropTypes.looseBool,
  id: PropTypes.string,
  // onChange: React.ChangeEventHandler<HTMLInputElement>;
};

// export interface SelectionBoxState {
//   checked?: PropTypes.looseBool,
// }

export const FilterMenuProps = {
  locale: TableLocale,
  selectedKeys: PropTypes.array,
  column: PropTypes.object,
  confirmFilter: PropTypes.func,
  prefixCls: PropTypes.string,
  dropdownPrefixCls: PropTypes.string,
  getPopupContainer: PropTypes.func,
  handleFilter: PropTypes.func,
};

// export interface FilterMenuState {
//   selectedKeys: string[];
//   keyPathOfSelectedItem: { [key: string]: string };
//   visible?: PropTypes.looseBool,
// }
