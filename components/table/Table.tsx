import { defineComponent, inject, markRaw, reactive } from 'vue';
import CaretUpFilled from '@ant-design/icons-vue/CaretUpFilled';
import CaretDownFilled from '@ant-design/icons-vue/CaretDownFilled';
import VcTable, { INTERNAL_COL_DEFINE } from '../vc-table';
import classNames from '../_util/classNames';
import shallowEqual from '../_util/shallowequal';
import FilterDropdown from './filterDropdown';
import SelectionBox from './SelectionBox';
import SelectionCheckboxAll from './SelectionCheckboxAll';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import createBodyRow from './createBodyRow';
import { flatArray, treeMap, flatFilter } from './util';
import { getOptionProps } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import BaseMixin from '../_util/BaseMixin';
import { defaultConfigProvider } from '../config-provider';
import type {
  TableComponents,
  TableState,
  TableProps,
  ColumnProps,
  TableStateFilters,
} from './interface';
import { tableProps } from './interface';
import Pagination from '../pagination';
import Spin from '../spin';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import warning from '../_util/warning';
import scrollTo from '../_util/scrollTo';
import TransButton from '../_util/transButton';

function noop() {}

function stopPropagation(e) {
  e.stopPropagation();
}

function getRowSelection(props: TableProps) {
  return props.rowSelection || {};
}

function getColumnKey(column: ColumnProps, index?: number) {
  return column.key || column.dataIndex || index;
}

function isSameColumn(a: ColumnProps, b: ColumnProps): boolean {
  if (a && b && a.key && a.key === b.key) {
    return true;
  }
  return (
    a === b ||
    shallowEqual(a, b, (value, other) => {
      // https://github.com/ant-design/ant-design/issues/12737
      if (typeof value === 'function' && typeof other === 'function') {
        return value === other || value.toString() === other.toString();
      }
      // https://github.com/ant-design/ant-design/issues/19398
      if (Array.isArray(value) && Array.isArray(other)) {
        return value === other || shallowEqual(value, other);
      }
    })
  );
}

const defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop,
};

/**
 * Avoid creating new object, so that parent component's shouldComponentUpdate
 * can works appropriately。
 */
const emptyObject = {};

const createComponents = (components: TableComponents = {}) => {
  const bodyRow = components && components.body && components.body.row;
  return {
    ...components,
    body: {
      ...components.body,
      row: createBodyRow(bodyRow),
    },
  };
};

function isTheSameComponents(components1: TableComponents = {}, components2: TableComponents = {}) {
  return (
    components1 === components2 ||
    ['table', 'header', 'body'].every(key => shallowEqual(components1[key], components2[key]))
  );
}

function getFilteredValueColumns(state: TableState, columns?: ColumnProps) {
  return flatFilter(
    columns || (state || {}).columns || [],
    (column: ColumnProps) => typeof column.filteredValue !== 'undefined',
  );
}

function getFiltersFromColumns(state: TableState, columns: ColumnProps) {
  const filters = {};
  getFilteredValueColumns(state, columns).forEach((col: ColumnProps) => {
    const colKey = getColumnKey(col);
    filters[colKey] = col.filteredValue;
  });
  return filters;
}

function isFiltersChanged(state: TableState, filters: TableStateFilters[]) {
  if (Object.keys(filters).length !== Object.keys(state.filters).length) {
    return true;
  }
  return Object.keys(filters).some(columnKey => filters[columnKey] !== state.filters[columnKey]);
}

export const defaultTableProps = initDefaultProps(tableProps, {
  dataSource: [],
  useFixedHeader: false,
  // rowSelection: null,
  size: 'default',
  loading: false,
  bordered: false,
  indentSize: 20,
  locale: {},
  rowKey: 'key',
  showHeader: true,
  sortDirections: ['ascend', 'descend'],
  childrenColumnName: 'children',
});

export default defineComponent({
  name: 'Table',
  mixins: [BaseMixin],
  inheritAttrs: false,
  Column,
  ColumnGroup,
  props: defaultTableProps,

  setup(props) {
    const store = reactive({
      selectedRowKeys: getRowSelection(props).selectedRowKeys || [],
      selectionDirty: false,
    });
    return {
      vcTable: null,
      checkboxPropsCache: {},
      store,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },

  data(this) {
    const props = getOptionProps(this);
    warning(
      !props.expandedRowRender || !('scroll' in props),
      '`expandedRowRender` and `scroll` are not compatible. Please use one of them at one time.',
    );
    const { getDefaultSortOrder, getDefaultFilters, getDefaultPagination } = this as typeof this & {
      getDefaultSortOrder: Function;
      getDefaultFilters: Function;
      getDefaultPagination: Function;
    };
    return {
      ...getDefaultSortOrder(props.columns || []),
      // 减少状态
      sFilters: getDefaultFilters(props.columns),
      sPagination: getDefaultPagination(this.$props),
      pivot: undefined,
      sComponents: markRaw(createComponents(this.components)),
      filterDataCnt: 0,
    };
  },
  watch: {
    pagination: {
      handler(val) {
        this.setState(previousState => {
          const newPagination = {
            ...defaultPagination,
            ...previousState.sPagination,
            ...val,
          };
          newPagination.current = newPagination.current || 1;
          newPagination.pageSize = newPagination.pageSize || 10;
          return { sPagination: val !== false ? newPagination : emptyObject };
        });
      },
      deep: true,
    },
    rowSelection: {
      handler(val, oldVal) {
        if (val && 'selectedRowKeys' in val) {
          this.store.selectedRowKeys = val.selectedRowKeys || [];
          const { rowSelection } = this;
          if (rowSelection && val.getCheckboxProps !== rowSelection.getCheckboxProps) {
            this.checkboxPropsCache = {};
          }
        } else if (oldVal && !val) {
          this.store.selectedRowKeys = [];
        }
      },
      deep: true,
    },

    dataSource() {
      this.store.selectionDirty = false;
      this.checkboxPropsCache = {};
    },

    columns(val) {
      const filteredValueColumns = getFilteredValueColumns({ columns: val }, val);
      if (filteredValueColumns.length > 0) {
        const filtersFromColumns = getFiltersFromColumns({ columns: val }, val);
        const newFilters = { ...this.sFilters };
        Object.keys(filtersFromColumns).forEach(key => {
          newFilters[key] = filtersFromColumns[key];
        });
        if (isFiltersChanged({ filters: this.sFilters }, newFilters)) {
          this.setState({ sFilters: newFilters });
        }
      }
    },
    components: {
      handler(val, oldVal) {
        if (!isTheSameComponents(val, oldVal)) {
          const components = createComponents(val);
          this.setState({ sComponents: components });
        }
      },
      deep: true,
    },
  },
  updated() {
    const { columns, sSortColumn: sortColumn, sSortOrder: sortOrder } = this;
    if (this.getSortOrderColumns(columns).length > 0) {
      const sortState = this.getSortStateFromColumns(columns);
      if (!isSameColumn(sortState.sSortColumn, sortColumn) || sortState.sSortOrder !== sortOrder) {
        this.setState(sortState);
      }
    }
  },
  methods: {
    setTableRef(table) {
      this.vcTable = table;
    },
    getCheckboxPropsByItem(item, index) {
      const rowSelection = getRowSelection(this.$props);
      if (!rowSelection.getCheckboxProps) {
        return {};
      }
      const key = this.getRecordKey(item, index);
      // Cache checkboxProps
      if (!this.checkboxPropsCache[key]) {
        this.checkboxPropsCache[key] = rowSelection.getCheckboxProps(item) || {};
      }
      return this.checkboxPropsCache[key];
    },

    getDefaultSelection() {
      const rowSelection = getRowSelection(this.$props);
      if (!rowSelection.getCheckboxProps) {
        return [];
      }
      return this.getFlatData()
        .filter((item, rowIndex) => this.getCheckboxPropsByItem(item, rowIndex).defaultChecked)
        .map((record, rowIndex) => this.getRecordKey(record, rowIndex));
    },

    getDefaultPagination(props) {
      const pagination = typeof props.pagination === 'object' ? props.pagination : {};
      let current;
      if ('current' in pagination) {
        current = pagination.current;
      } else if ('defaultCurrent' in pagination) {
        current = pagination.defaultCurrent;
      }
      let pageSize;
      if ('pageSize' in pagination) {
        pageSize = pagination.pageSize;
      } else if ('defaultPageSize' in pagination) {
        pageSize = pagination.defaultPageSize;
      }
      return this.hasPagination(props)
        ? {
            ...defaultPagination,
            ...pagination,
            current: current || 1,
            pageSize: pageSize || 10,
          }
        : {};
    },

    getSortOrderColumns(columns) {
      return flatFilter(columns || this.columns || [], column => 'sortOrder' in column);
    },

    getDefaultFilters(columns) {
      const definedFilters = getFiltersFromColumns({ columns: this.columns }, columns);

      const defaultFilteredValueColumns = flatFilter(
        columns || [],
        column => typeof column.defaultFilteredValue !== 'undefined',
      );

      const defaultFilters = defaultFilteredValueColumns.reduce((soFar, col) => {
        const colKey = getColumnKey(col);
        soFar[colKey] = col.defaultFilteredValue;
        return soFar;
      }, {});

      return { ...defaultFilters, ...definedFilters };
    },

    getDefaultSortOrder(columns) {
      const definedSortState = this.getSortStateFromColumns(columns);

      const defaultSortedColumn = flatFilter(columns || [], column => {
        return column.defaultSortOrder != null;
      })[0];

      if (defaultSortedColumn && !definedSortState.sortColumn) {
        return {
          sSortColumn: defaultSortedColumn,
          sSortOrder: defaultSortedColumn.defaultSortOrder,
        };
      }

      return definedSortState;
    },

    getSortStateFromColumns(columns) {
      // return first column which sortOrder is not falsy
      const sortedColumn = this.getSortOrderColumns(columns).filter(col => col.sortOrder)[0];

      if (sortedColumn) {
        return {
          sSortColumn: sortedColumn,
          sSortOrder: sortedColumn.sortOrder,
        };
      }

      return {
        sSortColumn: null,
        sSortOrder: null,
      };
    },
    getMaxCurrent(total) {
      const { current, pageSize } = this.sPagination;
      if ((current - 1) * pageSize >= total) {
        return Math.floor((total - 1) / pageSize) + 1;
      }
      return current;
    },

    getRecordKey(record, index) {
      const { rowKey } = this;
      const recordKey = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warning(
        recordKey !== undefined,
        'Table',
        'Each record in dataSource of table should have a unique `key` prop, ' +
          'or set `rowKey` of Table to an unique primary key, ',
      );
      return recordKey === undefined ? index : recordKey;
    },

    getSorterFn(state) {
      const { sSortOrder: sortOrder, sSortColumn: sortColumn } = state || this.$data;
      if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== 'function') {
        return;
      }

      return (a, b) => {
        const result = sortColumn.sorter(a, b, sortOrder);
        if (result !== 0) {
          return sortOrder === 'descend' ? -result : result;
        }
        return 0;
      };
    },

    getCurrentPageData() {
      let data = this.getLocalData();
      this.filterDataCnt = data.length;
      let current;
      let pageSize;
      const sPagination = this.sPagination;
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
        data = data.slice((current - 1) * pageSize, current * pageSize);
      }
      return data;
    },

    getFlatData() {
      const { childrenColumnName } = this.$props;
      return flatArray(this.getLocalData(null, false), childrenColumnName);
    },

    getFlatCurrentPageData() {
      const { childrenColumnName } = this.$props;
      return flatArray(this.getCurrentPageData(), childrenColumnName);
    },

    getLocalData(state, filter = true) {
      const currentState = state || this.$data;
      const { sFilters: filters } = currentState;
      const { dataSource } = this.$props;
      let data = dataSource || [];
      // 优化本地排序
      data = data.slice(0);
      const sorterFn = this.getSorterFn(currentState);
      if (sorterFn) {
        // 使用新数组，避免改变原数组导致无限循环更新
        // https://github.com/vueComponent/ant-design-vue/issues/2270
        data = this.recursiveSort([...data], sorterFn);
      }
      // 筛选
      if (filter && filters) {
        Object.keys(filters).forEach(columnKey => {
          const col = this.findColumn(columnKey);
          if (!col) {
            return;
          }
          const values = filters[columnKey] || [];
          if (values.length === 0) {
            return;
          }
          const onFilter = col.onFilter;
          data = onFilter
            ? data.filter(record => {
                return values.some(v => onFilter(v, record));
              })
            : data;
        });
      }
      return data;
    },
    onRow(prefixCls, record, index) {
      const { customRow } = this;
      const custom = customRow ? customRow(record, index) : {};
      return { ...custom, prefixCls, store: this.store, rowKey: this.getRecordKey(record, index) };
    },

    setSelectedRowKeys(selectedRowKeys, selectionInfo) {
      const { selectWay, record, checked, changeRowKeys, nativeEvent } = selectionInfo;
      const rowSelection = getRowSelection(this.$props);
      if (rowSelection && !('selectedRowKeys' in rowSelection)) {
        this.store.selectedRowKeys = selectedRowKeys;
      }
      const data = this.getFlatData();
      if (!rowSelection.onChange && !rowSelection[selectWay]) {
        return;
      }
      const selectedRows = data.filter(
        (row, i) => selectedRowKeys.indexOf(this.getRecordKey(row, i)) >= 0,
      );
      if (rowSelection.onChange) {
        rowSelection.onChange(selectedRowKeys, selectedRows);
      }
      if (selectWay === 'onSelect' && rowSelection.onSelect) {
        rowSelection.onSelect(record, checked, selectedRows, nativeEvent);
      } else if (selectWay === 'onSelectMultiple' && rowSelection.onSelectMultiple) {
        const changeRows = data.filter(
          (row, i) => changeRowKeys.indexOf(this.getRecordKey(row, i)) >= 0,
        );
        rowSelection.onSelectMultiple(checked, selectedRows, changeRows);
      } else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
        const changeRows = data.filter(
          (row, i) => changeRowKeys.indexOf(this.getRecordKey(row, i)) >= 0,
        );
        rowSelection.onSelectAll(checked, selectedRows, changeRows);
      } else if (selectWay === 'onSelectInvert' && rowSelection.onSelectInvert) {
        rowSelection.onSelectInvert(selectedRowKeys);
      }
    },
    generatePopupContainerFunc(getPopupContainer) {
      const { scroll } = this.$props;
      const table = this.vcTable;
      if (getPopupContainer) {
        return getPopupContainer;
      }
      // Use undefined to let rc component use default logic.
      return scroll && table ? () => table.tableNode : undefined;
    },
    scrollToFirstRow() {
      const { scroll } = this.$props;
      if (scroll && scroll.scrollToFirstRowOnChange !== false) {
        scrollTo(0, {
          getContainer: () => {
            return this.vcTable.ref_bodyTable;
          },
        });
      }
    },
    isSameColumn(a, b) {
      if (a && b && a.key && a.key === b.key) {
        return true;
      }
      return (
        a === b ||
        shallowEqual(a, b, (value, other) => {
          if (typeof value === 'function' && typeof other === 'function') {
            return value === other || value.toString() === other.toString();
          }
        })
      );
    },

    handleFilter(column, nextFilters) {
      const props = this.$props;
      const pagination = { ...this.sPagination };
      const filters = {
        ...this.sFilters,
        [getColumnKey(column)]: nextFilters,
      };
      // Remove filters not in current columns
      const currentColumnKeys = [];
      treeMap(this.columns, c => {
        if (!c.children) {
          currentColumnKeys.push(getColumnKey(c));
        }
      });
      Object.keys(filters).forEach(columnKey => {
        if (currentColumnKeys.indexOf(columnKey) < 0) {
          delete filters[columnKey];
        }
      });

      if (props.pagination) {
        // Reset current prop
        pagination.current = 1;
        pagination.onChange(pagination.current);
      }

      const newState = {
        sPagination: pagination,
        sFilters: {},
      };
      const filtersToSetState = { ...filters };
      // Remove filters which is controlled
      getFilteredValueColumns({ columns: props.columns }).forEach(col => {
        const columnKey = getColumnKey(col);
        if (columnKey) {
          delete filtersToSetState[columnKey];
        }
      });
      if (Object.keys(filtersToSetState).length > 0) {
        newState.sFilters = filtersToSetState;
      }

      // Controlled current prop will not respond user interaction
      if (typeof props.pagination === 'object' && 'current' in props.pagination) {
        newState.sPagination = {
          ...pagination,
          current: this.sPagination.current,
        };
      }

      this.setState(newState, () => {
        this.scrollToFirstRow();
        this.store.selectionDirty = false;
        this.$emit(
          'change',
          ...this.prepareParamsArguments({
            ...this.$data,
            sSelectionDirty: false,
            sFilters: filters,
            sPagination: pagination,
          }),
        );
      });
    },

    handleSelect(record, rowIndex, e) {
      const checked = e.target.checked;
      const nativeEvent = e.nativeEvent;
      const defaultSelection = this.store.selectionDirty ? [] : this.getDefaultSelection();
      let selectedRowKeys = this.store.selectedRowKeys.concat(defaultSelection);
      const key = this.getRecordKey(record, rowIndex);
      const { pivot } = this.$data;
      const rows = this.getFlatCurrentPageData();
      let realIndex = rowIndex;
      if (this.$props.expandedRowRender) {
        realIndex = rows.findIndex(row => this.getRecordKey(row, rowIndex) === key);
      }
      if (nativeEvent.shiftKey && pivot !== undefined && realIndex !== pivot) {
        const changeRowKeys = [];
        const direction = Math.sign(pivot - realIndex);
        const dist = Math.abs(pivot - realIndex);
        let step = 0;
        while (step <= dist) {
          const i = realIndex + step * direction;
          step += 1;
          const row = rows[i];
          const rowKey = this.getRecordKey(row, i);
          const checkboxProps = this.getCheckboxPropsByItem(row, i);
          if (!checkboxProps.disabled) {
            if (selectedRowKeys.includes(rowKey)) {
              if (!checked) {
                selectedRowKeys = selectedRowKeys.filter(j => rowKey !== j);
                changeRowKeys.push(rowKey);
              }
            } else if (checked) {
              selectedRowKeys.push(rowKey);
              changeRowKeys.push(rowKey);
            }
          }
        }

        this.setState({ pivot: realIndex });
        this.store.selectionDirty = true;
        this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelectMultiple',
          record,
          checked,
          changeRowKeys,
          nativeEvent,
        });
      } else {
        if (checked) {
          selectedRowKeys.push(this.getRecordKey(record, realIndex));
        } else {
          selectedRowKeys = selectedRowKeys.filter(i => key !== i);
        }
        this.setState({ pivot: realIndex });
        this.store.selectionDirty = true;
        this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelect',
          record,
          checked,
          changeRowKeys: undefined,
          nativeEvent,
        });
      }
    },

    handleRadioSelect(record, rowIndex, e) {
      const checked = e.target.checked;
      const nativeEvent = e.nativeEvent;
      const key = this.getRecordKey(record, rowIndex);
      const selectedRowKeys = [key];
      this.store.selectionDirty = true;
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record,
        checked,
        changeRowKeys: undefined,
        nativeEvent,
      });
    },

    handleSelectRow(selectionKey, index, onSelectFunc) {
      const data = this.getFlatCurrentPageData();
      const defaultSelection = this.store.selectionDirty ? [] : this.getDefaultSelection();
      const selectedRowKeys = this.store.selectedRowKeys.concat(defaultSelection);
      const changeableRowKeys = data
        .filter((item, i) => !this.getCheckboxPropsByItem(item, i).disabled)
        .map((item, i) => this.getRecordKey(item, i));

      const changeRowKeys = [];
      let selectWay = 'onSelectAll';
      let checked;
      // handle default selection
      switch (selectionKey) {
        case 'all':
          changeableRowKeys.forEach(key => {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = true;
          break;
        case 'removeAll':
          changeableRowKeys.forEach(key => {
            if (selectedRowKeys.indexOf(key) >= 0) {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = false;
          break;
        case 'invert':
          changeableRowKeys.forEach(key => {
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
      this.store.selectionDirty = true;
      // when select custom selection, callback selections[n].onSelect
      const { rowSelection } = this;
      let customSelectionStartIndex = 2;
      if (rowSelection && rowSelection.hideDefaultSelections) {
        customSelectionStartIndex = 0;
      }
      if (index >= customSelectionStartIndex && typeof onSelectFunc === 'function') {
        return onSelectFunc(changeableRowKeys);
      }
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay,
        checked,
        changeRowKeys,
      });
    },

    handlePageChange(current, ...otherArguments) {
      const props = this.$props;
      const pagination = { ...this.sPagination };
      if (current) {
        pagination.current = current;
      } else {
        pagination.current = pagination.current || 1;
      }
      pagination.onChange(pagination.current, ...otherArguments);

      const newState = {
        sPagination: pagination,
      };
      // Controlled current prop will not respond user interaction
      if (
        props.pagination &&
        typeof props.pagination === 'object' &&
        'current' in props.pagination
      ) {
        newState.sPagination = {
          ...pagination,
          current: this.sPagination.current,
        };
      }
      this.setState(newState, this.scrollToFirstRow);

      this.store.selectionDirty = false;
      this.$emit(
        'change',
        ...this.prepareParamsArguments({
          ...this.$data,
          sSelectionDirty: false,
          sPagination: pagination,
        }),
      );
    },

    handleShowSizeChange(current, pageSize) {
      const pagination = this.sPagination;
      pagination.onShowSizeChange(current, pageSize);
      const nextPagination = {
        ...pagination,
        pageSize,
        current,
      };
      this.setState({ sPagination: nextPagination }, this.scrollToFirstRow);
      this.$emit(
        'change',
        ...this.prepareParamsArguments({
          ...this.$data,
          sPagination: nextPagination,
        }),
      );
    },

    toggleSortOrder(column) {
      const sortDirections = column.sortDirections || this.sortDirections;
      const { sSortOrder: sortOrder, sSortColumn: sortColumn } = this;
      // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题
      let newSortOrder;
      // 切换另一列时，丢弃 sortOrder 的状态
      if (isSameColumn(sortColumn, column) && sortOrder !== undefined) {
        // 按照sortDirections的内容依次切换排序状态
        const methodIndex = sortDirections.indexOf(sortOrder) + 1;
        newSortOrder =
          methodIndex === sortDirections.length ? undefined : sortDirections[methodIndex];
      } else {
        newSortOrder = sortDirections[0];
      }
      const newState = {
        sSortOrder: newSortOrder,
        sSortColumn: newSortOrder ? column : null,
      };

      // Controlled
      if (this.getSortOrderColumns().length === 0) {
        this.setState(newState, this.scrollToFirstRow);
      }
      this.$emit(
        'change',
        ...this.prepareParamsArguments(
          {
            ...this.$data,
            ...newState,
          },
          column,
        ),
      );
    },

    hasPagination(props) {
      return (props || this.$props).pagination !== false;
    },

    isSortColumn(column) {
      const { sSortColumn: sortColumn } = this;
      if (!column || !sortColumn) {
        return false;
      }
      return getColumnKey(sortColumn) === getColumnKey(column);
    },

    // Get pagination, filters, sorter
    prepareParamsArguments(state, column) {
      const pagination = { ...state.sPagination };
      // remove useless handle function in Table.onChange
      delete pagination.onChange;
      delete pagination.onShowSizeChange;
      const filters = state.sFilters;
      const sorter: any = {};
      let currentColumn = column;
      if (state.sSortColumn && state.sSortOrder) {
        currentColumn = state.sSortColumn;
        sorter.column = state.sSortColumn;
        sorter.order = state.sSortOrder;
      }

      if (currentColumn) {
        sorter.field = currentColumn.dataIndex;
        sorter.columnKey = getColumnKey(currentColumn);
      }

      const extra = {
        currentDataSource: this.getLocalData(state),
      };

      return [pagination, filters, sorter, extra];
    },

    findColumn(myKey) {
      let column;
      treeMap(this.columns, c => {
        if (getColumnKey(c) === myKey) {
          column = c;
        }
      });
      return column;
    },

    recursiveSort(data, sorterFn) {
      const { childrenColumnName = 'children' } = this;
      return data.sort(sorterFn).map(item =>
        item[childrenColumnName]
          ? {
              ...item,
              [childrenColumnName]: this.recursiveSort([...item[childrenColumnName]], sorterFn),
            }
          : item,
      );
    },
    renderExpandIcon(prefixCls: string) {
      if (this.expandIcon) {
        return this.expandIcon;
      }
      return ({ expandable, expanded, needIndentSpaced, record, onExpand }) => {
        if (expandable) {
          return (
            <LocaleReceiver
              componentName="Table"
              defaultLocale={defaultLocale.Table}
              children={(locale: any) => (
                <TransButton
                  class={classNames(`${prefixCls}-row-expand-icon`, {
                    [`${prefixCls}-row-collapsed`]: !expanded,
                    [`${prefixCls}-row-expanded`]: expanded,
                  })}
                  onClick={(event: Event) => {
                    onExpand(record, event);
                  }}
                  aria-label={expanded ? locale.collapse : locale.expand}
                  noStyle
                />
              )}
            />
          );
        }

        if (needIndentSpaced) {
          return <span class={`${prefixCls}-row-expand-icon ${prefixCls}-row-spaced`} />;
        }

        return null;
      };
    },
    renderPagination(prefixCls, paginationPosition) {
      // 强制不需要分页
      if (!this.hasPagination()) {
        return null;
      }
      let size = 'default';
      const { sPagination: pagination } = this;
      if (pagination.size) {
        size = pagination.size;
      } else if (this.size === 'middle' || this.size === 'small') {
        size = 'small';
      }
      const position = pagination.position || 'bottom';
      const total = pagination.total || this.filterDataCnt;
      const { class: cls, style, onChange, onShowSizeChange, ...restProps } = pagination; // eslint-disable-line
      const paginationProps = {
        key: `pagination-${paginationPosition}`,
        class: classNames(cls, `${prefixCls}-pagination`),
        ...restProps,
        total,
        size,
        current: this.getMaxCurrent(total),
        style,
        onChange: this.handlePageChange,
        onShowSizeChange: this.handleShowSizeChange,
      };
      return total > 0 && (position === paginationPosition || position === 'both') ? (
        <Pagination {...paginationProps} />
      ) : null;
    },
    renderSelectionBox(type) {
      return ({ record, index }) => {
        const rowKey = this.getRecordKey(record, index); // 从 1 开始
        const props = this.getCheckboxPropsByItem(record, index);
        const handleChange = e => {
          type === 'radio'
            ? this.handleRadioSelect(record, index, e)
            : this.handleSelect(record, index, e);
        };
        const selectionBoxProps = {
          type,
          store: this.store,
          rowIndex: rowKey,
          defaultSelection: this.getDefaultSelection(),
          onChange: handleChange,
          ...props,
        };

        return (
          <span onClick={stopPropagation}>
            <SelectionBox {...selectionBoxProps} />
          </span>
        );
      };
    },

    renderRowSelection({ prefixCls, locale, getPopupContainer }) {
      const { rowSelection } = this;
      const columns = this.columns.concat();
      if (rowSelection) {
        const data = this.getFlatCurrentPageData().filter((item, index) => {
          if (rowSelection.getCheckboxProps) {
            return !this.getCheckboxPropsByItem(item, index).disabled;
          }
          return true;
        });
        const selectionColumnClass = classNames(`${prefixCls}-selection-column`, {
          [`${prefixCls}-selection-column-custom`]: rowSelection.selections,
        });
        const selectionColumn = {
          key: 'selection-column',
          customRender: this.renderSelectionBox(rowSelection.type),
          className: selectionColumnClass,
          fixed: rowSelection.fixed,
          width: rowSelection.columnWidth,
          title: rowSelection.columnTitle,
          [INTERNAL_COL_DEFINE]: {
            class: `${prefixCls}-selection-col`,
          },
        };
        if (rowSelection.type !== 'radio') {
          const checkboxAllDisabled = data.every(
            (item, index) => this.getCheckboxPropsByItem(item, index).disabled,
          );
          selectionColumn.title = selectionColumn.title || (
            <SelectionCheckboxAll
              store={this.store}
              locale={locale}
              data={data}
              getCheckboxPropsByItem={this.getCheckboxPropsByItem}
              getRecordKey={this.getRecordKey}
              disabled={checkboxAllDisabled}
              prefixCls={prefixCls}
              onSelect={this.handleSelectRow}
              selections={rowSelection.selections}
              hideDefaultSelections={rowSelection.hideDefaultSelections}
              getPopupContainer={this.generatePopupContainerFunc(getPopupContainer)}
              propsSymbol={Symbol()}
            />
          );
        }
        if ('fixed' in rowSelection) {
          selectionColumn.fixed = rowSelection.fixed;
        } else if (columns.some(column => column.fixed === 'left' || column.fixed === true)) {
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

    renderColumnsDropdown({ prefixCls, dropdownPrefixCls, columns, locale, getPopupContainer }) {
      const { sSortOrder: sortOrder, sFilters: filters } = this;
      return treeMap(columns, (column, i) => {
        const key = getColumnKey(column, i);
        let filterDropdown;
        let sortButton;
        let customHeaderCell = column.customHeaderCell;
        const isSortColumn = this.isSortColumn(column);
        if ((column.filters && column.filters.length > 0) || column.filterDropdown) {
          const colFilters = key in filters ? filters[key] : [];
          filterDropdown = (
            <FilterDropdown
              locale={locale}
              column={column}
              selectedKeys={colFilters}
              confirmFilter={this.handleFilter}
              prefixCls={`${prefixCls}-filter`}
              dropdownPrefixCls={dropdownPrefixCls || 'ant-dropdown'}
              getPopupContainer={this.generatePopupContainerFunc(getPopupContainer)}
              key="filter-dropdown"
            />
          );
        }
        if (column.sorter) {
          const sortDirections = column.sortDirections || this.sortDirections;
          const isAscend = isSortColumn && sortOrder === 'ascend';
          const isDescend = isSortColumn && sortOrder === 'descend';
          const ascend = sortDirections.indexOf('ascend') !== -1 && (
            <CaretUpFilled
              class={`${prefixCls}-column-sorter-up ${isAscend ? 'on' : 'off'}`}
              key="caret-up"
            />
          );

          const descend = sortDirections.indexOf('descend') !== -1 && (
            <CaretDownFilled
              class={`${prefixCls}-column-sorter-down ${isDescend ? 'on' : 'off'}`}
              key="caret-down"
            />
          );

          sortButton = (
            <div
              title={locale.sortTitle}
              class={classNames(
                `${prefixCls}-column-sorter-inner`,
                ascend && descend && `${prefixCls}-column-sorter-inner-full`,
              )}
              key="sorter"
            >
              {ascend}
              {descend}
            </div>
          );
          customHeaderCell = col => {
            let colProps: any = {};
            // Get original first
            if (column.customHeaderCell) {
              colProps = {
                ...column.customHeaderCell(col),
              };
            }
            // Add sorter logic
            const onHeaderCellClick = colProps.onClick;
            colProps.onClick = (...args) => {
              this.toggleSortOrder(column);
              if (onHeaderCellClick) {
                onHeaderCellClick(...args);
              }
            };
            return colProps;
          };
        }
        return {
          ...column,
          className: classNames(column.className, {
            [`${prefixCls}-column-has-actions`]: sortButton || filterDropdown,
            [`${prefixCls}-column-has-filters`]: filterDropdown,
            [`${prefixCls}-column-has-sorters`]: sortButton,
            [`${prefixCls}-column-sort`]: isSortColumn && sortOrder,
          }),
          title: [
            <span key="title" class={`${prefixCls}-header-column`}>
              <div class={sortButton ? `${prefixCls}-column-sorters` : undefined}>
                <span class={`${prefixCls}-column-title`}>
                  {this.renderColumnTitle(column.title)}
                </span>
                <span class={`${prefixCls}-column-sorter`}>{sortButton}</span>
              </div>
            </span>,
            filterDropdown,
          ],
          customHeaderCell,
        };
      });
    },
    renderColumnTitle(title) {
      const { sFilters: filters, sSortOrder: sortOrder, sSortColumn: sortColumn } = this.$data;
      // https://github.com/ant-design/ant-design/issues/11246#issuecomment-405009167
      if (title instanceof Function) {
        return title({
          filters,
          sortOrder,
          sortColumn,
        });
      }
      return title;
    },

    renderTable({
      prefixCls,
      renderEmpty,
      dropdownPrefixCls,
      contextLocale,
      getPopupContainer: contextGetPopupContainer,
      transformCellText,
    }) {
      const { showHeader, locale, getPopupContainer, style, ...restProps } = {
        ...getOptionProps(this),
        ...this.$attrs,
      } as any;
      const data = this.getCurrentPageData();
      const expandIconAsCell = this.expandedRowRender && this.expandIconAsCell !== false;

      // use props.getPopupContainer first
      const realGetPopupContainer = getPopupContainer || contextGetPopupContainer;

      // Merge too locales
      const mergedLocale = { ...contextLocale, ...locale };
      if (!locale || !locale.emptyText) {
        mergedLocale.emptyText = renderEmpty('Table');
      }

      const classString = classNames({
        [`${prefixCls}-${this.size}`]: true,
        [`${prefixCls}-bordered`]: this.bordered,
        [`${prefixCls}-empty`]: !data.length,
        [`${prefixCls}-without-column-header`]: !showHeader,
      });

      const columnsWithRowSelection = this.renderRowSelection({
        prefixCls,
        locale: mergedLocale,
        getPopupContainer: realGetPopupContainer,
      });
      const columns = this.renderColumnsDropdown({
        columns: columnsWithRowSelection,
        prefixCls,
        dropdownPrefixCls,
        locale: mergedLocale,
        getPopupContainer: realGetPopupContainer,
      }).map((column, i) => {
        const newColumn = { ...column };
        newColumn.key = getColumnKey(newColumn, i);
        return newColumn;
      });

      let expandIconColumnIndex = columns[0] && columns[0].key === 'selection-column' ? 1 : 0;
      if ('expandIconColumnIndex' in restProps) {
        expandIconColumnIndex = restProps.expandIconColumnIndex;
      }
      const vcTableProps = {
        key: 'table',
        expandIcon: this.renderExpandIcon(prefixCls),
        ...restProps,
        customRow: (record, index) => this.onRow(prefixCls, record, index),
        components: this.sComponents,
        prefixCls,
        data,
        columns,
        showHeader,
        expandIconColumnIndex,
        expandIconAsCell,
        emptyText: mergedLocale.emptyText,
        transformCellText,
        class: classString,
        ref: this.setTableRef,
      };
      return <VcTable {...vcTableProps} />;
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      dropdownPrefixCls: customizeDropdownPrefixCls,
      transformCellText: customizeTransformCellText,
    } = this;
    const data = this.getCurrentPageData();
    const { getPopupContainer: getContextPopupContainer, transformCellText: tct } =
      this.configProvider;
    const getPopupContainer = this.getPopupContainer || getContextPopupContainer;
    const transformCellText = customizeTransformCellText || tct;
    let loading = this.loading;
    if (typeof loading === 'boolean') {
      loading = {
        spinning: loading,
      };
    }
    const getPrefixCls = this.configProvider.getPrefixCls;
    const renderEmpty = this.configProvider.renderEmpty;

    const prefixCls = getPrefixCls('table', customizePrefixCls);
    const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

    const table = (
      <LocaleReceiver
        componentName="Table"
        defaultLocale={defaultLocale.Table}
        children={locale =>
          this.renderTable({
            prefixCls,
            renderEmpty,
            dropdownPrefixCls,
            contextLocale: locale,
            getPopupContainer,
            transformCellText,
          })
        }
      />
    );

    // if there is no pagination or no data,
    // the height of spin should decrease by half of pagination
    const paginationPatchClass =
      this.hasPagination() && data && data.length !== 0
        ? `${prefixCls}-with-pagination`
        : `${prefixCls}-without-pagination`;
    const spinProps = {
      ...loading,
      class: loading && loading.spinning ? `${paginationPatchClass} ${prefixCls}-spin-holder` : '',
    };
    const { class: className, style } = this.$attrs;
    return (
      <div class={classNames(`${prefixCls}-wrapper`, className)} style={style}>
        <Spin {...spinProps}>
          {this.renderPagination(prefixCls, 'top')}
          {table}
          {this.renderPagination(prefixCls, 'bottom')}
        </Spin>
      </div>
    );
  },
});
