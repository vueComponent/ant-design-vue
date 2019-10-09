import PropTypes from '../_util/vue-types';
import { PaginationProps as getPaginationProps } from '../pagination';
import { SpinProps as getSpinProps } from '../spin';
import { Store } from './createStore';

const PaginationProps = getPaginationProps();
const SpinProps = getSpinProps();

// export type CompareFn<T> = ((a: T, b: T) => number);
export const ColumnFilterItem = PropTypes.shape({
  text: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.array,
}).loose;

export const ColumnProps = {
  title: PropTypes.any,
  // key?: React.Key;
  dataIndex: PropTypes.string,
  customRender: PropTypes.func,
  customCell: PropTypes.func,
  customHeaderCell: PropTypes.func,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  filters: PropTypes.arrayOf(ColumnFilterItem),
  // onFilter: (value: any, record: T) => PropTypes.bool,
  filterMultiple: PropTypes.bool,
  filterDropdown: PropTypes.any,
  filterDropdownVisible: PropTypes.bool,
  // onFilterDropdownVisibleChange?: (visible: boolean) => void;
  sorter: PropTypes.oneOfType([PropTypes.boolean, PropTypes.func]),
  defaultSortOrder: PropTypes.oneOf(['ascend', 'descend']),
  colSpan: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['left', 'right'])]),
  filterIcon: PropTypes.any,
  filteredValue: PropTypes.array,
  sortOrder: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['ascend', 'descend'])]),
  sortDirections: PropTypes.array,
  // children?: ColumnProps<T>[];
  // onCellClick?: (record: T, event: any) => void;
  // onCell?: (record: T) => any;
  // onHeaderCell?: (props: ColumnProps<T>) => any;
};

// export interface TableComponents {
//   table?: any;
//   header?: {
//     wrapper?: any;
//     row?: any;
//     cell?: any;
//   };
//   body?: {
//     wrapper?: any;
//     row?: any;
//     cell?: any;
//   };
// }

export const TableLocale = PropTypes.shape({
  filterTitle: PropTypes.string,
  filterConfirm: PropTypes.any,
  filterReset: PropTypes.any,
  emptyText: PropTypes.any,
  selectAll: PropTypes.any,
  selectInvert: PropTypes.any,
  sortTitle: PropTypes.string,
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
  selections: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  hideDefaultSelections: PropTypes.bool,
  fixed: PropTypes.bool,
  columnWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectWay: PropTypes.oneOf(['onSelect', 'onSelectMultiple', 'onSelectAll', 'onSelectInvert']),
  columnTitle: PropTypes.any,
};

export const TableProps = {
  prefixCls: PropTypes.string,
  dropdownPrefixCls: PropTypes.string,
  rowSelection: PropTypes.oneOfType([PropTypes.shape(TableRowSelection).loose, null]),
  pagination: PropTypes.oneOfType([
    PropTypes.shape({
      ...PaginationProps,
      position: PropTypes.oneOf(['top', 'bottom', 'both']),
    }).loose,
    PropTypes.bool,
  ]),
  size: PropTypes.oneOf(['default', 'middle', 'small', 'large']),
  dataSource: PropTypes.array,
  components: PropTypes.object,
  columns: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowClassName: PropTypes.func,
  expandedRowRender: PropTypes.any,
  defaultExpandAllRows: PropTypes.bool,
  defaultExpandedRowKeys: PropTypes.array,
  expandedRowKeys: PropTypes.array,
  expandIconAsCell: PropTypes.bool,
  expandIconColumnIndex: PropTypes.number,
  expandRowByClick: PropTypes.bool,
  // onExpandedRowsChange?: (expandedRowKeys: string[] | number[]) => void;
  //  onExpand?: (expanded: boolean, record: T) => void;
  // onChange?: (pagination: PaginationProps | boolean, filters: string[], sorter: Object) => any;
  loading: PropTypes.oneOfType([PropTypes.shape(SpinProps).loose, PropTypes.bool]),
  locale: TableLocale,
  indentSize: PropTypes.number,
  // onRowClick?: (record: T, index: number, event: Event) => any;
  customRow: PropTypes.func,
  customHeaderRow: PropTypes.func,
  useFixedHeader: PropTypes.bool,
  bordered: PropTypes.bool,
  showHeader: PropTypes.bool,
  footer: PropTypes.func,
  title: PropTypes.func,
  scroll: PropTypes.object,
  childrenColumnName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  bodyStyle: PropTypes.any,
  sortDirections: PropTypes.array,
  expandIcon: PropTypes.func,
  // className?: PropTypes.string,
  // style?: React.CSSProperties;
  // children?: React.ReactNode;
};

// export interface TableStateFilters {
//   [key: string]: string[];
// }

// export interface TableState<T> {
//   pagination: PaginationProps;
//   filters: TableStateFilters;
//   sortColumn: ColumnProps<T> | null;
//   sortOrder: PropTypes.string,
// }

// export type SelectionItemSelectFn = (key: string[]) => any;

// export interface SelectionItem {
//   key: PropTypes.string,
//   text: PropTypes.any,
//   onSelect: SelectionItemSelectFn;
// }

export const SelectionCheckboxAllProps = {
  store: Store,
  locale: PropTypes.any,
  disabled: PropTypes.bool,
  getCheckboxPropsByItem: PropTypes.func,
  getRecordKey: PropTypes.func,
  data: PropTypes.array,
  prefixCls: PropTypes.string,
  // onSelect: (key: string, index: number, selectFunc: any) => void;
  hideDefaultSelections: PropTypes.bool,
  selections: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  getPopupContainer: PropTypes.func,
};

// export interface SelectionCheckboxAllState {
//   checked: PropTypes.bool,
//   indeterminate: PropTypes.bool,
// }

export const SelectionBoxProps = {
  store: Store,
  type: RowSelectionType,
  defaultSelection: PropTypes.arrayOf([PropTypes.string, PropTypes.number]),
  rowIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  // onChange: React.ChangeEventHandler<HTMLInputElement>;
};

// export interface SelectionBoxState {
//   checked?: PropTypes.bool,
// }

export const FilterMenuProps = {
  _propsSymbol: PropTypes.any,
  locale: TableLocale,
  selectedKeys: PropTypes.arrayOf([PropTypes.string, PropTypes.number]),
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
//   visible?: PropTypes.bool,
// }
