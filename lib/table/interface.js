'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterMenuProps = exports.SelectionBoxProps = exports.SelectionCheckboxAllProps = exports.TableProps = exports.TableRowSelection = exports.RowSelectionType = exports.TableLocale = exports.ColumnProps = exports.ColumnFilterItem = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _pagination = require('../pagination');

var _spin = require('../spin');

var _createStore = require('./createStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PaginationProps = (0, _pagination.PaginationProps)();
var SpinProps = (0, _spin.SpinProps)();

// export type CompareFn<T> = ((a: T, b: T) => number);
var ColumnFilterItem = exports.ColumnFilterItem = _vueTypes2['default'].shape({
  text: _vueTypes2['default'].string,
  value: _vueTypes2['default'].string,
  children: _vueTypes2['default'].array
}).loose;

var ColumnProps = exports.ColumnProps = {
  title: _vueTypes2['default'].any,
  // key?: React.Key;
  dataIndex: _vueTypes2['default'].string,
  customRender: _vueTypes2['default'].func,
  customCell: _vueTypes2['default'].func,
  customHeaderCell: _vueTypes2['default'].func,
  align: _vueTypes2['default'].oneOf(['left', 'right', 'center']),
  filters: _vueTypes2['default'].arrayOf(ColumnFilterItem),
  // onFilter: (value: any, record: T) => PropTypes.bool,
  filterMultiple: _vueTypes2['default'].bool,
  filterDropdown: _vueTypes2['default'].any,
  filterDropdownVisible: _vueTypes2['default'].bool,
  // onFilterDropdownVisibleChange?: (visible: boolean) => void;
  sorter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].boolean, _vueTypes2['default'].func]),
  defaultSortOrder: _vueTypes2['default'].oneOf(['ascend', 'descend']),
  colSpan: _vueTypes2['default'].number,
  width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  className: _vueTypes2['default'].string,
  fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].oneOf(['left', 'right'])]),
  filterIcon: _vueTypes2['default'].any,
  filteredValue: _vueTypes2['default'].array,
  sortOrder: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].oneOf(['ascend', 'descend'])])
  // children?: ColumnProps<T>[];
  // onCellClick?: (record: T, event: any) => void;
  // onCell?: (record: T) => any;
  // onHeaderCell?: (props: ColumnProps<T>) => any;


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

};var TableLocale = exports.TableLocale = _vueTypes2['default'].shape({
  filterTitle: _vueTypes2['default'].string,
  filterConfirm: _vueTypes2['default'].any,
  filterReset: _vueTypes2['default'].any,
  emptyText: _vueTypes2['default'].any,
  selectAll: _vueTypes2['default'].any,
  selectInvert: _vueTypes2['default'].any
}).loose;

var RowSelectionType = exports.RowSelectionType = _vueTypes2['default'].oneOf(['checkbox', 'radio']);
// export type SelectionSelectFn<T> = (record: T, selected: boolean, selectedRows: Object[]) => any;

var TableRowSelection = exports.TableRowSelection = {
  type: RowSelectionType,
  selectedRowKeys: _vueTypes2['default'].array,
  // onChange?: (selectedRowKeys: string[] | number[], selectedRows: Object[]) => any;
  getCheckboxProps: _vueTypes2['default'].func,
  // onSelect?: SelectionSelectFn<T>;
  // onSelectAll?: (selected: boolean, selectedRows: Object[], changeRows: Object[]) => any;
  // onSelectInvert?: (selectedRows: Object[]) => any;
  selections: _vueTypes2['default'].oneOfType([_vueTypes2['default'].array, _vueTypes2['default'].bool]),
  hideDefaultSelections: _vueTypes2['default'].bool,
  fixed: _vueTypes2['default'].bool,
  columnWidth: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])
};

var TableProps = exports.TableProps = {
  prefixCls: _vueTypes2['default'].string,
  dropdownPrefixCls: _vueTypes2['default'].string,
  rowSelection: _vueTypes2['default'].oneOfType([_vueTypes2['default'].shape(TableRowSelection).loose, null]),
  pagination: _vueTypes2['default'].oneOfType([_vueTypes2['default'].shape((0, _extends3['default'])({}, PaginationProps, {
    position: _vueTypes2['default'].oneOf(['top', 'bottom', 'both'])
  })).loose, _vueTypes2['default'].bool]),
  size: _vueTypes2['default'].oneOf(['default', 'middle', 'small', 'large']),
  dataSource: _vueTypes2['default'].array,
  components: _vueTypes2['default'].object,
  columns: _vueTypes2['default'].array,
  rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].func]),
  rowClassName: _vueTypes2['default'].func,
  expandedRowRender: _vueTypes2['default'].any,
  defaultExpandAllRows: _vueTypes2['default'].bool,
  defaultExpandedRowKeys: _vueTypes2['default'].array,
  expandedRowKeys: _vueTypes2['default'].array,
  expandIconAsCell: _vueTypes2['default'].bool,
  expandIconColumnIndex: _vueTypes2['default'].number,
  expandRowByClick: _vueTypes2['default'].bool,
  // onExpandedRowsChange?: (expandedRowKeys: string[] | number[]) => void;
  //  onExpand?: (expanded: boolean, record: T) => void;
  // onChange?: (pagination: PaginationProps | boolean, filters: string[], sorter: Object) => any;
  loading: _vueTypes2['default'].oneOfType([_vueTypes2['default'].shape(SpinProps).loose, _vueTypes2['default'].bool]),
  locale: _vueTypes2['default'].object,
  indentSize: _vueTypes2['default'].number,
  // onRowClick?: (record: T, index: number, event: Event) => any;
  customRow: _vueTypes2['default'].func,
  customHeaderRow: _vueTypes2['default'].func,
  useFixedHeader: _vueTypes2['default'].bool,
  bordered: _vueTypes2['default'].bool,
  showHeader: _vueTypes2['default'].bool,
  footer: _vueTypes2['default'].func,
  title: _vueTypes2['default'].func,
  scroll: _vueTypes2['default'].object,
  childrenColumnName: _vueTypes2['default'].string,
  bodyStyle: _vueTypes2['default'].any
  // className?: PropTypes.string,
  // style?: React.CSSProperties;
  // children?: React.ReactNode;


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

};var SelectionCheckboxAllProps = exports.SelectionCheckboxAllProps = {
  store: _createStore.Store,
  locale: _vueTypes2['default'].any,
  disabled: _vueTypes2['default'].bool,
  getCheckboxPropsByItem: _vueTypes2['default'].func,
  getRecordKey: _vueTypes2['default'].func,
  data: _vueTypes2['default'].array,
  prefixCls: _vueTypes2['default'].string,
  // onSelect: (key: string, index: number, selectFunc: any) => void;
  hideDefaultSelections: _vueTypes2['default'].bool,
  selections: _vueTypes2['default'].oneOfType([_vueTypes2['default'].array, _vueTypes2['default'].bool]),
  getPopupContainer: _vueTypes2['default'].func

  // export interface SelectionCheckboxAllState {
  //   checked: PropTypes.bool,
  //   indeterminate: PropTypes.bool,
  // }

};var SelectionBoxProps = exports.SelectionBoxProps = {
  store: _createStore.Store,
  type: RowSelectionType,
  defaultSelection: _vueTypes2['default'].arrayOf([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  rowIndex: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  name: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].bool,
  id: _vueTypes2['default'].string
  // onChange: React.ChangeEventHandler<HTMLInputElement>;


  // export interface SelectionBoxState {
  //   checked?: PropTypes.bool,
  // }

};var FilterMenuProps = exports.FilterMenuProps = {
  locale: TableLocale,
  selectedKeys: _vueTypes2['default'].arrayOf([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  column: _vueTypes2['default'].object,
  confirmFilter: _vueTypes2['default'].func,
  prefixCls: _vueTypes2['default'].string,
  dropdownPrefixCls: _vueTypes2['default'].string,
  getPopupContainer: _vueTypes2['default'].func,
  handleFilter: _vueTypes2['default'].func

  // export interface FilterMenuState {
  //   selectedKeys: string[];
  //   keyPathOfSelectedItem: { [key: string]: string };
  //   visible?: PropTypes.bool,
  // }

};