import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';

import VcTable from '../vc-table';
import classNames from 'classnames';
import Pagination from '../pagination';
import Icon from '../icon';
import Spin from '../spin';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import warning from '../_util/warning';
import FilterDropdown from './filterDropdown';
import createStore from './createStore';
import SelectionBox from './SelectionBox';
import SelectionCheckboxAll from './SelectionCheckboxAll';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import createBodyRow from './createBodyRow';
import { flatArray, treeMap, flatFilter } from './util';
import { initDefaultProps, mergeProps, getOptionProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { TableProps } from './interface';

function noop() {}

function stopPropagation(e) {
  e.stopPropagation();
  if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
}

var defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop

  /**
   * Avoid creating new object, so that parent component's shouldComponentUpdate
   * can works appropriately。
   */
};var emptyObject = {};

export default {
  name: 'Table',
  Column: Column,
  ColumnGroup: ColumnGroup,
  mixins: [BaseMixin],
  props: initDefaultProps(TableProps, {
    dataSource: [],
    prefixCls: 'ant-table',
    useFixedHeader: false,
    // rowSelection: null,
    size: 'large',
    loading: false,
    bordered: false,
    indentSize: 20,
    locale: {},
    rowKey: 'key',
    showHeader: true
  }),

  // CheckboxPropsCache: {
  //   [key: string]: any;
  // };
  // store: Store;
  // columns: ColumnProps<T>[];
  // components: TableComponents;

  data: function data() {
    // this.columns = props.columns || normalizeColumns(props.children)

    this.createComponents(this.components);
    this.CheckboxPropsCache = {};

    this.store = createStore({
      selectedRowKeys: (this.rowSelection || {}).selectedRowKeys || [],
      selectionDirty: false
    });
    return _extends({}, this.getDefaultSortOrder(this.columns), {
      // 减少状态
      sFilters: this.getFiltersFromColumns(),
      sPagination: this.getDefaultPagination(this.$props)
    });
  },

  watch: {
    pagination: {
      handler: function handler(val) {
        this.setState(function (previousState) {
          var newPagination = _extends({}, defaultPagination, previousState.sPagination, val);
          newPagination.current = newPagination.current || 1;
          newPagination.pageSize = newPagination.pageSize || 10;
          return { sPagination: val !== false ? newPagination : emptyObject };
        });
      },

      deep: true
    },
    rowSelection: {
      handler: function handler(val) {
        if (val && 'selectedRowKeys' in val) {
          this.store.setState({
            selectedRowKeys: val.selectedRowKeys || []
          });
          var rowSelection = this.rowSelection;

          if (rowSelection && val.getCheckboxProps !== rowSelection.getCheckboxProps) {
            this.CheckboxPropsCache = {};
          }
        }
      },

      deep: true
    },
    dataSource: function dataSource(val) {
      this.store.setState({
        selectionDirty: false
      });
      this.CheckboxPropsCache = {};
    },
    columns: function columns(val) {
      if (this.getSortOrderColumns(val).length > 0) {
        var sortState = this.getSortStateFromColumns(val);
        if (sortState.sSortColumn !== this.sSortColumn || sortState.sSortOrder !== this.sSortOrder) {
          this.setState(sortState);
        }
      }

      var filteredValueColumns = this.getFilteredValueColumns(val);
      if (filteredValueColumns.length > 0) {
        var filtersFromColumns = this.getFiltersFromColumns(val);
        var newFilters = _extends({}, this.sFilters);
        Object.keys(filtersFromColumns).forEach(function (key) {
          newFilters[key] = filtersFromColumns[key];
        });
        if (this.isFiltersChanged(newFilters)) {
          this.setState({ sFilters: newFilters });
        }
      }
    },
    components: function components(val, preVal) {
      this.createComponents(val, preVal);
    }
  },
  methods: {
    getCheckboxPropsByItem: function getCheckboxPropsByItem(item, index) {
      var _rowSelection = this.rowSelection,
          rowSelection = _rowSelection === undefined ? {} : _rowSelection;

      if (!rowSelection.getCheckboxProps) {
        return { props: {} };
      }
      var key = this.getRecordKey(item, index);
      // Cache checkboxProps
      if (!this.CheckboxPropsCache[key]) {
        this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps(item);
      }
      this.CheckboxPropsCache[key].props = this.CheckboxPropsCache[key].props || {};
      return this.CheckboxPropsCache[key];
    },
    getDefaultSelection: function getDefaultSelection() {
      var _this = this;

      var _rowSelection2 = this.rowSelection,
          rowSelection = _rowSelection2 === undefined ? {} : _rowSelection2;

      if (!rowSelection.getCheckboxProps) {
        return [];
      }
      return this.getFlatData().filter(function (item, rowIndex) {
        return _this.getCheckboxPropsByItem(item, rowIndex).props.defaultChecked;
      }).map(function (record, rowIndex) {
        return _this.getRecordKey(record, rowIndex);
      });
    },
    getDefaultPagination: function getDefaultPagination(props) {
      var pagination = props.pagination || {};
      return this.hasPagination(props) ? _extends({}, defaultPagination, pagination, {
        current: pagination.defaultCurrent || pagination.current || 1,
        pageSize: pagination.defaultPageSize || pagination.pageSize || 10
      }) : {};
    },
    onRow: function onRow(record, index) {
      var prefixCls = this.prefixCls,
          customRow = this.customRow;

      var custom = customRow ? customRow(record, index) : {};
      return mergeProps(custom, {
        props: {
          prefixCls: prefixCls,
          store: this.store,
          rowKey: this.getRecordKey(record, index)
        }
      });
    },
    setSelectedRowKeys: function setSelectedRowKeys(selectedRowKeys, _ref) {
      var _this2 = this;

      var selectWay = _ref.selectWay,
          record = _ref.record,
          checked = _ref.checked,
          changeRowKeys = _ref.changeRowKeys,
          nativeEvent = _ref.nativeEvent;
      var _rowSelection3 = this.rowSelection,
          rowSelection = _rowSelection3 === undefined ? {} : _rowSelection3;

      if (rowSelection && !('selectedRowKeys' in rowSelection)) {
        this.store.setState({ selectedRowKeys: selectedRowKeys });
      }
      var data = this.getFlatData();
      if (!rowSelection.onChange && !rowSelection[selectWay]) {
        return;
      }
      var selectedRows = data.filter(function (row, i) {
        return selectedRowKeys.indexOf(_this2.getRecordKey(row, i)) >= 0;
      });
      if (rowSelection.onChange) {
        rowSelection.onChange(selectedRowKeys, selectedRows);
      }
      if (selectWay === 'onSelect' && rowSelection.onSelect) {
        rowSelection.onSelect(record, checked, selectedRows, nativeEvent);
      } else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
        var changeRows = data.filter(function (row, i) {
          return changeRowKeys.indexOf(_this2.getRecordKey(row, i)) >= 0;
        });
        rowSelection.onSelectAll(checked, selectedRows, changeRows);
      } else if (selectWay === 'onSelectInvert' && rowSelection.onSelectInvert) {
        rowSelection.onSelectInvert(selectedRowKeys);
      }
    },
    hasPagination: function hasPagination() {
      return this.pagination !== false;
    },
    isFiltersChanged: function isFiltersChanged(filters) {
      var _this3 = this;

      var filtersChanged = false;
      if (Object.keys(filters).length !== Object.keys(this.sFilters).length) {
        filtersChanged = true;
      } else {
        Object.keys(filters).forEach(function (columnKey) {
          if (filters[columnKey] !== _this3.sFilters[columnKey]) {
            filtersChanged = true;
          }
        });
      }
      return filtersChanged;
    },
    getSortOrderColumns: function getSortOrderColumns(columns) {
      return flatFilter(columns || this.columns || [], function (column) {
        return 'sortOrder' in column;
      });
    },
    getFilteredValueColumns: function getFilteredValueColumns(columns) {
      return flatFilter(columns || this.columns || [], function (column) {
        return typeof column.filteredValue !== 'undefined';
      });
    },
    getFiltersFromColumns: function getFiltersFromColumns(columns) {
      var _this4 = this;

      var filters = {};
      this.getFilteredValueColumns(columns).forEach(function (col) {
        var colKey = _this4.getColumnKey(col);
        filters[colKey] = col.filteredValue;
      });
      return filters;
    },
    getDefaultSortOrder: function getDefaultSortOrder(columns) {
      var definedSortState = this.getSortStateFromColumns(columns);

      var defaultSortedColumn = flatFilter(columns || [], function (column) {
        return column.defaultSortOrder != null;
      })[0];

      if (defaultSortedColumn && !definedSortState.sortColumn) {
        return {
          sSortColumn: defaultSortedColumn,
          sSortOrder: defaultSortedColumn.defaultSortOrder
        };
      }

      return definedSortState;
    },
    getSortStateFromColumns: function getSortStateFromColumns(columns) {
      // return first column which sortOrder is not falsy
      var sortedColumn = this.getSortOrderColumns(columns).filter(function (col) {
        return col.sortOrder;
      })[0];

      if (sortedColumn) {
        return {
          sSortColumn: sortedColumn,
          sSortOrder: sortedColumn.sortOrder
        };
      }

      return {
        sSortColumn: null,
        sSortOrder: null
      };
    },
    getSorterFn: function getSorterFn() {
      var sortOrder = this.sSortOrder,
          sortColumn = this.sSortColumn;

      if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== 'function') {
        return;
      }

      return function (a, b) {
        var result = sortColumn.sorter(a, b);
        if (result !== 0) {
          return sortOrder === 'descend' ? -result : result;
        }
        return 0;
      };
    },
    toggleSortOrder: function toggleSortOrder(order, column) {
      var sortOrder = this.sSortOrder,
          sortColumn = this.sSortColumn;
      // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题

      var isSortColumn = this.isSortColumn(column);
      if (!isSortColumn) {
        // 当前列未排序
        sortOrder = order;
        sortColumn = column;
      } else {
        // 当前列已排序
        if (sortOrder === order) {
          // 切换为未排序状态
          sortOrder = '';
          sortColumn = null;
        } else {
          // 切换为排序状态
          sortOrder = order;
        }
      }
      var newState = {
        sSortOrder: sortOrder,
        sSortColumn: sortColumn

        // Controlled
      };if (this.getSortOrderColumns().length === 0) {
        this.setState(newState);
      }
      this.$emit.apply(this, ['change'].concat(_toConsumableArray(this.prepareParamsArguments(_extends({}, this.$data, newState)))));
    },
    handleFilter: function handleFilter(column, nextFilters) {
      var _this5 = this;

      var props = this.$props;
      var pagination = _extends({}, this.sPagination);
      var filters = _extends({}, this.sFilters, _defineProperty({}, this.getColumnKey(column), nextFilters));
      // Remove filters not in current columns
      var currentColumnKeys = [];
      treeMap(this.columns, function (c) {
        if (!c.children) {
          currentColumnKeys.push(_this5.getColumnKey(c));
        }
      });
      Object.keys(filters).forEach(function (columnKey) {
        if (currentColumnKeys.indexOf(columnKey) < 0) {
          delete filters[columnKey];
        }
      });

      if (props.pagination) {
        // Reset current prop
        pagination.current = 1;
        pagination.onChange(pagination.current);
      }

      var newState = {
        sPagination: pagination,
        sFilters: {}
      };
      var filtersToSetState = _extends({}, filters);
      // Remove filters which is controlled
      this.getFilteredValueColumns().forEach(function (col) {
        var columnKey = _this5.getColumnKey(col);
        if (columnKey) {
          delete filtersToSetState[columnKey];
        }
      });
      if (Object.keys(filtersToSetState).length > 0) {
        newState.sFilters = filtersToSetState;
      }

      // Controlled current prop will not respond user interaction
      if (_typeof(props.pagination) === 'object' && 'current' in props.pagination) {
        newState.sPagination = _extends({}, pagination, {
          current: this.sPagination.current
        });
      }

      this.setState(newState, function () {
        _this5.store.setState({
          selectionDirty: false
        });
        _this5.$emit.apply(_this5, ['change'].concat(_toConsumableArray(_this5.prepareParamsArguments(_extends({}, _this5.$data, {
          sSelectionDirty: false,
          sFilters: filters,
          sPagination: pagination
        })))));
      });
    },
    handleSelect: function handleSelect(record, rowIndex, e) {
      var checked = e.target.checked;
      var nativeEvent = e.nativeEvent;
      var defaultSelection = this.store.getState().selectionDirty ? [] : this.getDefaultSelection();
      var selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
      var key = this.getRecordKey(record, rowIndex);
      if (checked) {
        selectedRowKeys.push(this.getRecordKey(record, rowIndex));
      } else {
        selectedRowKeys = selectedRowKeys.filter(function (i) {
          return key !== i;
        });
      }
      this.store.setState({
        selectionDirty: true
      });
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record: record,
        checked: checked,
        changeRowKeys: void 0,
        nativeEvent: nativeEvent
      });
    },
    handleRadioSelect: function handleRadioSelect(record, rowIndex, e) {
      var checked = e.target.checked;
      var nativeEvent = e.nativeEvent;
      var defaultSelection = this.store.getState().selectionDirty ? [] : this.getDefaultSelection();
      var selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
      var key = this.getRecordKey(record, rowIndex);
      selectedRowKeys = [key];
      this.store.setState({
        selectionDirty: true
      });
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record: record,
        checked: checked,
        changeRowKeys: void 0,
        nativeEvent: nativeEvent
      });
    },
    handleSelectRow: function handleSelectRow(selectionKey, index, onSelectFunc) {
      var _this6 = this;

      var data = this.getFlatCurrentPageData();
      var defaultSelection = this.store.getState().selectionDirty ? [] : this.getDefaultSelection();
      var selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
      var changeableRowKeys = data.filter(function (item, i) {
        return !_this6.getCheckboxPropsByItem(item, i).props.disabled;
      }).map(function (item, i) {
        return _this6.getRecordKey(item, i);
      });

      var changeRowKeys = [];
      var selectWay = '';
      var checked = void 0;
      // handle default selection
      switch (selectionKey) {
        case 'all':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = true;
          break;
        case 'removeAll':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) >= 0) {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = false;
          break;
        case 'invert':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
            } else {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
            }
            changeRowKeys.push(key);
            selectWay = 'onSelectInvert';
          });
          break;
        default:
          break;
      }

      this.store.setState({
        selectionDirty: true
      });
      // when select custom selection, callback selections[n].onSelect
      var rowSelection = this.rowSelection;

      var customSelectionStartIndex = 2;
      if (rowSelection && rowSelection.hideDefaultSelections) {
        customSelectionStartIndex = 0;
      }
      if (index >= customSelectionStartIndex && typeof onSelectFunc === 'function') {
        return onSelectFunc(changeableRowKeys);
      }
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: selectWay,
        checked: checked,
        changeRowKeys: changeRowKeys
      });
    },
    handlePageChange: function handlePageChange(current) {
      var props = this.$props;
      var pagination = _extends({}, this.sPagination);
      if (current) {
        pagination.current = current;
      } else {
        pagination.current = pagination.current || 1;
      }

      for (var _len = arguments.length, otherArguments = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherArguments[_key - 1] = arguments[_key];
      }

      pagination.onChange.apply(pagination, [pagination.current].concat(_toConsumableArray(otherArguments)));

      var newState = {
        sPagination: pagination
        // Controlled current prop will not respond user interaction
      };if (props.pagination && _typeof(props.pagination) === 'object' && 'current' in props.pagination) {
        newState.sPagination = _extends({}, pagination, {
          current: this.sPagination.current
        });
      }
      this.setState(newState);

      this.store.setState({
        selectionDirty: false
      });
      this.$emit.apply(this, ['change'].concat(_toConsumableArray(this.prepareParamsArguments(_extends({}, this.$data, {
        sSelectionDirty: false,
        sPagination: pagination
      })))));
    },
    renderSelectionBox: function renderSelectionBox(type) {
      var _this7 = this;

      var h = this.$createElement;

      return function (_, record, index) {
        var rowIndex = _this7.getRecordKey(record, index); // 从 1 开始
        var props = _this7.getCheckboxPropsByItem(record, index);
        var handleChange = function handleChange(e) {
          type === 'radio' ? _this7.handleRadioSelect(record, rowIndex, e) : _this7.handleSelect(record, rowIndex, e);
        };
        var selectionBoxProps = mergeProps({
          props: {
            type: type,
            store: _this7.store,
            rowIndex: rowIndex,
            defaultSelection: _this7.getDefaultSelection()
          },
          on: {
            change: handleChange
          }
        }, props);

        return h(
          'span',
          {
            on: {
              'click': stopPropagation
            }
          },
          [h(SelectionBox, selectionBoxProps)]
        );
      };
    },
    getRecordKey: function getRecordKey(record, index) {
      var rowKey = this.rowKey;
      var recordKey = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warning(recordKey !== undefined, 'Each record in dataSource of table should have a unique `key` prop, or set `rowKey` to an unique primary key,');
      return recordKey === undefined ? index : recordKey;
    },
    getPopupContainer: function getPopupContainer() {
      return this.$el;
    },
    renderRowSelection: function renderRowSelection(locale) {
      var _this8 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          rowSelection = this.rowSelection;

      var columns = this.columns.concat();
      if (rowSelection) {
        var data = this.getFlatCurrentPageData().filter(function (item, index) {
          if (rowSelection.getCheckboxProps) {
            return !_this8.getCheckboxPropsByItem(item, index).props.disabled;
          }
          return true;
        });
        var selectionColumnClass = classNames(prefixCls + '-selection-column', _defineProperty({}, prefixCls + '-selection-column-custom', rowSelection.selections));
        var selectionColumn = {
          key: 'selection-column',
          customRender: this.renderSelectionBox(rowSelection.type),
          className: selectionColumnClass,
          fixed: rowSelection.fixed,
          width: rowSelection.columnWidth
        };
        if (rowSelection.type !== 'radio') {
          var checkboxAllDisabled = data.every(function (item, index) {
            return _this8.getCheckboxPropsByItem(item, index).props.disabled;
          });
          selectionColumn.title = h(SelectionCheckboxAll, {
            attrs: {
              store: this.store,
              locale: locale,
              data: data,
              getCheckboxPropsByItem: this.getCheckboxPropsByItem,
              getRecordKey: this.getRecordKey,
              disabled: checkboxAllDisabled,
              prefixCls: prefixCls,

              selections: rowSelection.selections,
              hideDefaultSelections: rowSelection.hideDefaultSelections,
              getPopupContainer: this.getPopupContainer
            },
            on: {
              'select': this.handleSelectRow
            }
          });
        }
        if ('fixed' in rowSelection) {
          selectionColumn.fixed = rowSelection.fixed;
        } else if (columns.some(function (column) {
          return column.fixed === 'left' || column.fixed === true;
        })) {
          selectionColumn.fixed = 'left';
        }
        if (columns[0] && columns[0].key === 'selection-column') {
          columns[0] = selectionColumn;
        } else {
          columns.unshift(selectionColumn);
        }
      }
      return columns;
    },
    getColumnKey: function getColumnKey(column, index) {
      return column.key || column.dataIndex || index;
    },
    getMaxCurrent: function getMaxCurrent(total) {
      var _sPagination = this.sPagination,
          current = _sPagination.current,
          pageSize = _sPagination.pageSize;

      if ((current - 1) * pageSize >= total) {
        return Math.floor((total - 1) / pageSize) + 1;
      }
      return current;
    },
    isSortColumn: function isSortColumn(column) {
      var sortColumn = this.sSortColumn;

      if (!column || !sortColumn) {
        return false;
      }
      return this.getColumnKey(sortColumn) === this.getColumnKey(column);
    },
    renderColumnsDropdown: function renderColumnsDropdown(columns, locale) {
      var _this9 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          dropdownPrefixCls = this.dropdownPrefixCls;
      var sortOrder = this.sSortOrder;

      return treeMap(columns, function (originColumn, i) {
        var column = _extends({}, originColumn);
        var key = _this9.getColumnKey(column, i);
        var filterDropdown = void 0;
        var sortButton = void 0;
        if (column.filters && column.filters.length > 0 || column.filterDropdown) {
          var colFilters = _this9.sFilters[key] || [];
          filterDropdown = h(FilterDropdown, {
            attrs: {
              locale: locale,
              column: column,
              selectedKeys: colFilters,
              confirmFilter: _this9.handleFilter,
              prefixCls: prefixCls + '-filter',
              dropdownPrefixCls: dropdownPrefixCls || 'ant-dropdown',
              getPopupContainer: _this9.getPopupContainer
            }
          });
        }
        if (column.sorter) {
          var isSortColumn = _this9.isSortColumn(column);
          if (isSortColumn) {
            column.className = classNames(column.className, _defineProperty({}, prefixCls + '-column-sort', sortOrder));
          }
          var isAscend = isSortColumn && sortOrder === 'ascend';
          var isDescend = isSortColumn && sortOrder === 'descend';
          sortButton = h(
            'div',
            { 'class': prefixCls + '-column-sorter' },
            [h(
              'span',
              {
                'class': prefixCls + '-column-sorter-up ' + (isAscend ? 'on' : 'off'),
                attrs: { title: '\u2191'
                },
                on: {
                  'click': function click() {
                    return _this9.toggleSortOrder('ascend', column);
                  }
                }
              },
              [h(Icon, {
                attrs: { type: 'caret-up' }
              })]
            ), h(
              'span',
              {
                'class': prefixCls + '-column-sorter-down ' + (isDescend ? 'on' : 'off'),
                attrs: { title: '\u2193'
                },
                on: {
                  'click': function click() {
                    return _this9.toggleSortOrder('descend', column);
                  }
                }
              },
              [h(Icon, {
                attrs: { type: 'caret-down' }
              })]
            )]
          );
        }
        column.title = h(
          'span',
          { key: key },
          [column.title, sortButton, filterDropdown]
        );

        if (sortButton || filterDropdown) {
          column.className = classNames(prefixCls + '-column-has-filters', column.className);
        }

        return column;
      });
    },
    handleShowSizeChange: function handleShowSizeChange(current, pageSize) {
      var pagination = this.sPagination;
      pagination.onShowSizeChange(current, pageSize);
      var nextPagination = _extends({}, pagination, {
        pageSize: pageSize,
        current: current
      });
      this.setState({ sPagination: nextPagination });
      this.$emit.apply(this, ['change'].concat(_toConsumableArray(this.prepareParamsArguments(_extends({}, this.$data, {
        sPagination: nextPagination
      })))));
    },
    renderPagination: function renderPagination(paginationPosition) {
      var h = this.$createElement;

      // 强制不需要分页
      if (!this.hasPagination()) {
        return null;
      }
      var size = 'default';
      var pagination = this.sPagination;

      if (pagination.size) {
        size = pagination.size;
      } else if (this.size === 'middle' || this.size === 'small') {
        size = 'small';
      }
      var position = pagination.position || 'bottom';
      var total = pagination.total || this.getLocalData().length;

      var cls = pagination['class'],
          style = pagination.style,
          onChange = pagination.onChange,
          onShowSizeChange = pagination.onShowSizeChange,
          restProps = _objectWithoutProperties(pagination, ['class', 'style', 'onChange', 'onShowSizeChange']); // eslint-disable-line


      var paginationProps = mergeProps({
        key: 'pagination-' + paginationPosition,
        'class': classNames(cls, this.prefixCls + '-pagination'),
        props: _extends({}, restProps, {
          total: total,
          size: size,
          current: this.getMaxCurrent(total)
        }),
        style: style,
        on: {
          change: this.handlePageChange,
          showSizeChange: this.handleShowSizeChange
        }
      });
      return total > 0 && (position === paginationPosition || position === 'both') ? h(Pagination, paginationProps) : null;
    },


    // Get pagination, filters, sorter
    prepareParamsArguments: function prepareParamsArguments(state) {
      var pagination = _extends({}, state.sPagination);
      // remove useless handle function in Table.onChange
      delete pagination.onChange;
      delete pagination.onShowSizeChange;
      var filters = state.sFilters;
      var sorter = {};
      if (state.sSortColumn && state.sSortOrder) {
        sorter.column = state.sSortColumn;
        sorter.order = state.sSortOrder;
        sorter.field = state.sSortColumn.dataIndex;
        sorter.columnKey = this.getColumnKey(state.sSortColumn);
      }
      return [pagination, filters, sorter];
    },
    findColumn: function findColumn(myKey) {
      var _this10 = this;

      var column = void 0;
      treeMap(this.columns, function (c) {
        if (_this10.getColumnKey(c) === myKey) {
          column = c;
        }
      });
      return column;
    },
    getCurrentPageData: function getCurrentPageData() {
      var data = this.getLocalData();
      var current = void 0;
      var pageSize = void 0;
      var sPagination = this.sPagination;
      // 如果没有分页的话，默认全部展示
      if (!this.hasPagination()) {
        pageSize = Number.MAX_VALUE;
        current = 1;
      } else {
        pageSize = sPagination.pageSize;
        current = this.getMaxCurrent(sPagination.total || data.length);
      }

      // 分页
      // ---
      // 当数据量少于等于每页数量时，直接设置数据
      // 否则进行读取分页数据
      if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
        data = data.filter(function (_, i) {
          return i >= (current - 1) * pageSize && i < current * pageSize;
        });
      }
      return data;
    },
    getFlatData: function getFlatData() {
      return flatArray(this.getLocalData());
    },
    getFlatCurrentPageData: function getFlatCurrentPageData() {
      return flatArray(this.getCurrentPageData());
    },
    recursiveSort: function recursiveSort(data, sorterFn) {
      var _this11 = this;

      var _childrenColumnName = this.childrenColumnName,
          childrenColumnName = _childrenColumnName === undefined ? 'children' : _childrenColumnName;

      return data.sort(sorterFn).map(function (item) {
        return item[childrenColumnName] ? _extends({}, item, _defineProperty({}, childrenColumnName, _this11.recursiveSort(item[childrenColumnName], sorterFn))) : item;
      });
    },
    getLocalData: function getLocalData() {
      var _this12 = this;

      var dataSource = this.dataSource,
          filters = this.sFilters;

      var data = dataSource || [];
      // 优化本地排序
      data = data.slice(0);
      var sorterFn = this.getSorterFn();
      if (sorterFn) {
        data = this.recursiveSort(data, sorterFn);
      }
      // 筛选
      if (filters) {
        Object.keys(filters).forEach(function (columnKey) {
          var col = _this12.findColumn(columnKey);
          if (!col) {
            return;
          }
          var values = filters[columnKey] || [];
          if (values.length === 0) {
            return;
          }
          var onFilter = col.onFilter;
          data = onFilter ? data.filter(function (record) {
            return values.some(function (v) {
              return onFilter(v, record);
            });
          }) : data;
        });
      }
      return data;
    },
    createComponents: function createComponents() {
      var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var prevComponents = arguments[1];

      var bodyRow = components && components.body && components.body.row;
      var preBodyRow = prevComponents && prevComponents.body && prevComponents.body.row;
      if (!this.customComponents || bodyRow !== preBodyRow) {
        this.customComponents = _extends({}, components);
        this.customComponents.body = _extends({}, components.body, {
          row: createBodyRow(bodyRow)
        });
      }
    },
    renderTable: function renderTable(contextLocale, loading) {
      var _classNames3,
          _this13 = this;

      var h = this.$createElement;

      var locale = _extends({}, contextLocale, this.locale);

      var _getOptionProps = getOptionProps(this),
          prefixCls = _getOptionProps.prefixCls,
          showHeader = _getOptionProps.showHeader,
          restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'showHeader']);

      var data = this.getCurrentPageData();
      var expandIconAsCell = this.expandedRowRender && this.expandIconAsCell !== false;

      var classString = classNames((_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-' + this.size, true), _defineProperty(_classNames3, prefixCls + '-bordered', this.bordered), _defineProperty(_classNames3, prefixCls + '-empty', !data.length), _defineProperty(_classNames3, prefixCls + '-without-column-header', !showHeader), _classNames3));

      var columns = this.renderRowSelection(locale);
      columns = this.renderColumnsDropdown(columns, locale);
      columns = columns.map(function (column, i) {
        var newColumn = _extends({}, column);
        newColumn.key = _this13.getColumnKey(newColumn, i);
        return newColumn;
      });
      var expandIconColumnIndex = columns[0] && columns[0].key === 'selection-column' ? 1 : 0;
      if ('expandIconColumnIndex' in restProps) {
        expandIconColumnIndex = restProps.expandIconColumnIndex;
      }
      var vcTableProps = {
        key: 'table',
        props: _extends({}, restProps, {
          customRow: this.onRow,
          components: this.customComponents,
          prefixCls: prefixCls,
          data: data,
          columns: columns,
          showHeader: showHeader,
          expandIconColumnIndex: expandIconColumnIndex,
          expandIconAsCell: expandIconAsCell,
          emptyText: !(loading.props && loading.props.spinning) && locale.emptyText
        }),
        on: this.$listeners,
        'class': classString
      };
      return h(VcTable, vcTableProps);
    }
  },

  render: function render() {
    var _this14 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls;

    var data = this.getCurrentPageData();

    var loading = this.loading;
    if (typeof loading === 'boolean') {
      loading = {
        props: {
          spinning: loading
        }
      };
    } else {
      loading = {
        props: _extends({}, loading)
      };
    }

    var table = h(LocaleReceiver, {
      attrs: {
        componentName: 'Table',
        defaultLocale: defaultLocale.Table,
        children: function children(locale) {
          return _this14.renderTable(locale, loading);
        }
      }
    });

    // if there is no pagination or no data,
    // the height of spin should decrease by half of pagination
    var paginationPatchClass = this.hasPagination() && data && data.length !== 0 ? prefixCls + '-with-pagination' : prefixCls + '-without-pagination';
    var spinProps = _extends({}, loading, {
      'class': loading.props && loading.props.spinning ? paginationPatchClass + ' ' + prefixCls + '-spin-holder' : ''
    });
    return h(
      'div',
      {
        'class': classNames(prefixCls + '-wrapper')
      },
      [h(
        Spin,
        spinProps,
        [this.renderPagination('top'), table, this.renderPagination('bottom')]
      )]
    );
  }
};