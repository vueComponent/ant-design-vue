import PropTypes, { withUndefined } from '../_util/vue-types';
import { PaginationProps as getPaginationProps } from '../pagination';
import { SpinProps as getSpinProps } from '../spin';
import { Store } from './createStore';
import { tuple } from '../_util/type';
import { ExtractPropTypes } from 'vue';

const PaginationProps = getPaginationProps();
const SpinProps = getSpinProps();

// export type CompareFn<T> = ((a: T, b: T) => number);
export const ColumnFilterItem = PropTypes.shape({
  text: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.array,
}).loose;

export const ColumnProps = {
  title: PropTypes.VNodeChild,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataIndex: PropTypes.string,
  customRender: PropTypes.func,
  customCell: PropTypes.func,
  customHeaderCell: PropTypes.func,
  align: PropTypes.oneOf(tuple('left', 'right', 'center')),
  ellipsis: PropTypes.looseBool,
  filters: PropTypes.arrayOf(ColumnFilterItem),
  // onFilter: (value: any, record: T) => PropTypes.looseBool,
  filterMultiple: PropTypes.looseBool,
  filterDropdown: PropTypes.any,
  filterDropdownVisible: PropTypes.looseBool,
  // onFilterDropdownVisibleChange?: (visible: boolean) => void;
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

export type IColumnProps = Partial<ExtractPropTypes<typeof ColumnProps>>;

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

export const RowSelectionType = PropTypes.oneOf(['checkbox', 'radio']);
// export type SelectionSelectFn<T> = (record: T, selected: boolean, selectedRows: Object[]) => any;

export const TableRowSelection = {
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

export const TableProps = {
  prefixCls: PropTypes.string,
  dropdownPrefixCls: PropTypes.string,
  rowSelection: PropTypes.oneOfType([PropTypes.shape(TableRowSelection).loose, Object]),
  pagination: withUndefined(
    PropTypes.oneOfType([
      PropTypes.shape({
        ...PaginationProps,
        position: PropTypes.oneOf(tuple('top', 'bottom', 'both')),
      }).loose,
      PropTypes.looseBool,
    ]),
  ),
  size: PropTypes.oneOf(tuple('default', 'middle', 'small', 'large')),
  dataSource: PropTypes.array,
  components: PropTypes.object,
  columns: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowClassName: PropTypes.func,
  expandedRowRender: PropTypes.any,
  defaultExpandAllRows: PropTypes.looseBool,
  defaultExpandedRowKeys: PropTypes.array,
  expandedRowKeys: PropTypes.array,
  expandIconAsCell: PropTypes.looseBool,
  expandIconColumnIndex: PropTypes.number,
  expandRowByClick: PropTypes.looseBool,
  loading: PropTypes.oneOfType([PropTypes.shape(SpinProps).loose, PropTypes.looseBool]),
  locale: TableLocale,
  indentSize: PropTypes.number,
  customRow: PropTypes.func,
  customHeaderRow: PropTypes.func,
  useFixedHeader: PropTypes.looseBool,
  bordered: PropTypes.looseBool,
  showHeader: PropTypes.looseBool,
  footer: PropTypes.func,
  title: PropTypes.func,
  scroll: PropTypes.object,
  childrenColumnName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  bodyStyle: PropTypes.any,
  sortDirections: PropTypes.array,
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

export type ITableRowSelection = Partial<ExtractPropTypes<typeof TableRowSelection>>;

export type ITableProps = Partial<ExtractPropTypes<typeof TableProps>>;

export interface TableStateFilters {
  [key: string]: string[];
}

export interface TableState {
  pagination?: Partial<ExtractPropTypes<typeof PaginationProps>>;
  filters?: TableStateFilters;
  sortColumn?: Partial<ExtractPropTypes<typeof ColumnProps>> | null;
  sortOrder?: string;
  columns?: IColumnProps[];
}

// export type SelectionItemSelectFn = (key: string[]) => any;

// export interface SelectionItem {
//   key: PropTypes.string,
//   text: PropTypes.any,
//   onSelect: SelectionItemSelectFn;
// }

export const SelectionCheckboxAllProps = {
  propsSymbol: PropTypes.any,
  store: Store,
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
  store: Store,
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
