import VcTable from '../vc-table';
import classNames from 'classnames';
import shallowEqual from 'shallowequal';
import FilterDropdown from './filterDropdown';
import createStore from './createStore';
import SelectionBox from './SelectionBox';
import SelectionCheckboxAll from './SelectionCheckboxAll';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import createBodyRow from './createBodyRow';
import { flatArray, treeMap, flatFilter } from './util';
import {
  initDefaultProps,
  mergeProps,
  getOptionProps,
  isValidElement,
  filterEmpty,
  getAllProps,
  getComponentFromProp,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';
import { TableProps } from './interface';
import Pagination from '../pagination';
import Icon from '../icon';
import Spin, { SpinProps } from '../spin';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import warning from '../_util/warning';

function noop() {}

function stopPropagation(e) {
  e.stopPropagation();
  if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
}

function getRowSelection(props) {
  return props.rowSelection || {};
}

const defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop,
};

const ROW_SELECTION_COLUMN_WIDTH = '62px';

/**
 * Avoid creating new object, so that parent component's shouldComponentUpdate
 * can works appropriately。
 */
const emptyObject = {};

export default {
  name: 'Table',
  Column,
  ColumnGroup,
  mixins: [BaseMixin],
  props: initDefaultProps(TableProps, {
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
  }),

  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  // CheckboxPropsCache: {
  //   [key: string]: any;
  // };
  // store: Store;
  // columns: ColumnProps<T>[];
  // components: TableComponents;

  data() {
    // this.columns = props.columns || normalizeColumns(props.children)
    const props = getOptionProps(this);
    warning(
      !props.expandedRowRender || !('scroll' in props),
      '`expandedRowRender` and `scroll` are not compatible. Please use one of them at one time.',
    );
    this.createComponents(this.components);
    this.CheckboxPropsCache = {};

    this.store = createStore({
      selectedRowKeys: getRowSelection(this.$props).selectedRowKeys || [],
      selectionDirty: false,
    });
    return {
      ...this.getDefaultSortOrder(this.columns),
      // 减少状态
      sFilters: this.getFiltersFromColumns(),
      sPagination: this.getDefaultPagination(this.$props),
      pivot: undefined,
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
          this.store.setState({
            selectedRowKeys: val.selectedRowKeys || [],
          });
          const { rowSelection } = this;
          if (rowSelection && val.getCheckboxProps !== rowSelection.getCheckboxProps) {
            this.CheckboxPropsCache = {};
          }
        } else if (oldVal && !val) {
          this.store.setState({
            selectedRowKeys: [],
          });
        }
      },
      deep: true,
    },
    dataSource() {
      this.store.setState({
        selectionDirty: false,
      });
      this.CheckboxPropsCache = {};
    },
    columns(val) {
      if (this.getSortOrderColumns(val).length > 0) {
        const sortState = this.getSortStateFromColumns(val);
        if (
          sortState.sSortColumn !== this.sSortColumn ||
          sortState.sSortOrder !== this.sSortOrder
        ) {
          this.setState(sortState);
        }
      }

      const filteredValueColumns = this.getFilteredValueColumns(val);
      if (filteredValueColumns.length > 0) {
        const filtersFromColumns = this.getFiltersFromColumns(val);
        const newFilters = { ...this.sFilters };
        Object.keys(filtersFromColumns).forEach(key => {
          newFilters[key] = filtersFromColumns[key];
        });
        if (this.isFiltersChanged(newFilters)) {
          this.setState({ sFilters: newFilters });
        }
      }
    },
    components(val, preVal) {
      this.createComponents(val, preVal);
    },
  },
  methods: {
    getCheckboxPropsByItem(item, index) {
      const rowSelection = getRowSelection(this.$props);
      if (!rowSelection.getCheckboxProps) {
        return { props: {} };
      }
      const key = this.getRecordKey(item, index);
      // Cache checkboxProps
      if (!this.CheckboxPropsCache[key]) {
        this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps(item);
      }
      this.CheckboxPropsCache[key].props = this.CheckboxPropsCache[key].props || {};
      return this.CheckboxPropsCache[key];
    },

    getDefaultSelection() {
      const rowSelection = getRowSelection(this.$props);
      if (!rowSelection.getCheckboxProps) {
        return [];
      }
      return this.getFlatData()
        .filter(
          (item, rowIndex) => this.getCheckboxPropsByItem(item, rowIndex).props.defaultChecked,
        )
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

    onRow(prefixCls, record, index) {
      const { customRow } = this;
      const custom = customRow ? customRow(record, index) : {};
      return mergeProps(custom, {
        props: {
          prefixCls,
          store: this.store,
          rowKey: this.getRecordKey(record, index),
        },
      });
    },

    setSelectedRowKeys(selectedRowKeys, selectionInfo) {
      const { selectWay, record, checked, changeRowKeys, nativeEvent } = selectionInfo;
      const rowSelection = getRowSelection(this.$props);
      if (rowSelection && !('selectedRowKeys' in rowSelection)) {
        this.store.setState({ selectedRowKeys });
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

    hasPagination() {
      return this.pagination !== false;
    },

    isFiltersChanged(filters) {
      let filtersChanged = false;
      if (Object.keys(filters).length !== Object.keys(this.sFilters).length) {
        filtersChanged = true;
      } else {
        Object.keys(filters).forEach(columnKey => {
          if (filters[columnKey] !== this.sFilters[columnKey]) {
            filtersChanged = true;
          }
        });
      }
      return filtersChanged;
    },

    getSortOrderColumns(columns) {
      return flatFilter(columns || this.columns || [], column => 'sortOrder' in column);
    },

    getFilteredValueColumns(columns) {
      return flatFilter(
        columns || this.columns || [],
        column => typeof column.filteredValue !== 'undefined',
      );
    },

    getFiltersFromColumns(columns) {
      const filters = {};
      this.getFilteredValueColumns(columns).forEach(col => {
        const colKey = this.getColumnKey(col);
        filters[colKey] = col.filteredValue;
      });
      return filters;
    },

    getDefaultSortOrder(columns) {
      const definedSortState = this.getSortStateFromColumns(columns);

      const defaultSortedColumn = flatFilter(
        columns || [],
        column => column.defaultSortOrder != null,
      )[0];

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

    toggleSortOrder(column) {
      if (!column.sorter) {
        return;
      }
      const sortDirections = column.sortDirections || this.sortDirections;
      const { sSortOrder: sortOrder, sSortColumn: sortColumn } = this;
      // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题
      let newSortOrder;
      // 切换另一列时，丢弃 sortOrder 的状态
      if (this.isSameColumn(sortColumn, column) && sortOrder !== undefined) {
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
        this.setState(newState);
      }
      this.$emit(
        'change',
        ...this.prepareParamsArguments({
          ...this.$data,
          ...newState,
        }),
      );
    },

    handleFilter(column, nextFilters) {
      const props = this.$props;
      const pagination = { ...this.sPagination };
      const filters = {
        ...this.sFilters,
        [this.getColumnKey(column)]: nextFilters,
      };
      // Remove filters not in current columns
      const currentColumnKeys = [];
      treeMap(this.columns, c => {
        if (!c.children) {
          currentColumnKeys.push(this.getColumnKey(c));
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
      this.getFilteredValueColumns().forEach(col => {
        const columnKey = this.getColumnKey(col);
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
        this.store.setState({
          selectionDirty: false,
        });
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
      const defaultSelection = this.store.getState().selectionDirty
        ? []
        : this.getDefaultSelection();
      let selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
      const key = this.getRecordKey(record, rowIndex);
      const { pivot } = this.$data;
      const rows = this.getFlatCurrentPageData(this.$props.childrenColumnName);
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
        this.store.setState({
          selectionDirty: true,
        });
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
        this.store.setState({
          selectionDirty: true,
        });
        this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelect',
          record,
          checked,
          changeRowKeys: void 0,
          nativeEvent,
        });
      }
    },

    handleRadioSelect(record, rowIndex, e) {
      const checked = e.target.checked;
      const nativeEvent = e.nativeEvent;
      const key = this.getRecordKey(record, rowIndex);
      const selectedRowKeys = [key];
      this.store.setState({
        selectionDirty: true,
      });
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record,
        checked,
        changeRowKeys: void 0,
        nativeEvent,
      });
    },

    handleSelectRow(selectionKey, index, onSelectFunc) {
      const data = this.getFlatCurrentPageData(this.$props.childrenColumnName);
      const defaultSelection = this.store.getState().selectionDirty
        ? []
        : this.getDefaultSelection();
      const selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
      const changeableRowKeys = data
        .filter((item, i) => !this.getCheckboxPropsByItem(item, i).props.disabled)
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

      this.store.setState({
        selectionDirty: true,
      });
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
      this.setState(newState);

      this.store.setState({
        selectionDirty: false,
      });
      this.$emit(
        'change',
        ...this.prepareParamsArguments({
          ...this.$data,
          sSelectionDirty: false,
          sPagination: pagination,
        }),
      );
    },

    renderSelectionBox(type) {
      return (_, record, index) => {
        const rowKey = this.getRecordKey(record, index); // 从 1 开始
        const props = this.getCheckboxPropsByItem(record, index);
        const handleChange = e => {
          type === 'radio'
            ? this.handleRadioSelect(record, index, e)
            : this.handleSelect(record, index, e);
        };
        const selectionBoxProps = mergeProps(
          {
            props: {
              type,
              store: this.store,
              rowIndex: rowKey,
              defaultSelection: this.getDefaultSelection(),
            },
            on: {
              change: handleChange,
            },
          },
          props,
        );

        return (
          <span onClick={stopPropagation}>
            <SelectionBox {...selectionBoxProps} />
          </span>
        );
      };
    },

    getRecordKey(record, index) {
      const { rowKey } = this;
      const recordKey = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warning(
        recordKey !== undefined,
        'Each record in dataSource of table should have a unique `key` prop, or set `rowKey` of Table to an unique primary key,',
      );
      return recordKey === undefined ? index : recordKey;
    },

    getPopupContainer() {
      return this.$el;
    },

    generatePopupContainerFunc() {
      const { scroll } = this.$props;

      // Use undefined to let rc component use default logic.
      return scroll ? this.getPopupContainer : undefined;
    },

    renderRowSelection(prefixCls, locale) {
      const { rowSelection, childrenColumnName } = this;
      const columns = this.columns.concat();
      if (rowSelection) {
        const data = this.getFlatCurrentPageData(childrenColumnName).filter((item, index) => {
          if (rowSelection.getCheckboxProps) {
            return !this.getCheckboxPropsByItem(item, index).props.disabled;
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
          width: rowSelection.columnWidth || ROW_SELECTION_COLUMN_WIDTH,
          title: rowSelection.columnTitle,
        };
        if (rowSelection.type !== 'radio') {
          const checkboxAllDisabled = data.every(
            (item, index) => this.getCheckboxPropsByItem(item, index).props.disabled,
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
              getPopupContainer={this.generatePopupContainerFunc()}
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

    getColumnKey(column, index) {
      return column.key || column.dataIndex || index;
    },

    getMaxCurrent(total) {
      const { current, pageSize } = this.sPagination;
      if ((current - 1) * pageSize >= total) {
        return Math.floor((total - 1) / pageSize) + 1;
      }
      return current;
    },

    isSortColumn(column) {
      const { sSortColumn: sortColumn } = this;
      if (!column || !sortColumn) {
        return false;
      }
      return this.getColumnKey(sortColumn) === this.getColumnKey(column);
    },

    renderColumnsDropdown(prefixCls, dropdownPrefixCls, columns, locale) {
      const { sSortOrder: sortOrder, sFilters: filters } = this;
      return treeMap(columns, (column, i) => {
        const key = this.getColumnKey(column, i);
        let filterDropdown;
        let sortButton;
        let customHeaderCell = column.customHeaderCell;
        const title = this.renderColumnTitle(column.title);
        const isSortColumn = this.isSortColumn(column);
        if ((column.filters && column.filters.length > 0) || column.filterDropdown) {
          const colFilters = key in filters ? filters[key] : [];
          filterDropdown = (
            <FilterDropdown
              _propsSymbol={Symbol()}
              locale={locale}
              column={column}
              selectedKeys={colFilters}
              confirmFilter={this.handleFilter}
              prefixCls={`${prefixCls}-filter`}
              dropdownPrefixCls={dropdownPrefixCls || 'ant-dropdown'}
              getPopupContainer={this.generatePopupContainerFunc()}
              key="filter-dropdown"
            />
          );
        }
        if (column.sorter) {
          const sortDirections = column.sortDirections || this.sortDirections;
          const isAscend = isSortColumn && sortOrder === 'ascend';
          const isDescend = isSortColumn && sortOrder === 'descend';
          const ascend = sortDirections.indexOf('ascend') !== -1 && (
            <Icon
              class={`${prefixCls}-column-sorter-up ${isAscend ? 'on' : 'off'}`}
              type="caret-up"
              theme="filled"
              key="caret-up"
            />
          );

          const descend = sortDirections.indexOf('descend') !== -1 && (
            <Icon
              class={`${prefixCls}-column-sorter-down ${isDescend ? 'on' : 'off'}`}
              type="caret-down"
              theme="filled"
              key="caret-down"
            />
          );

          sortButton = (
            <div title={locale.sortTitle} class={`${prefixCls}-column-sorter`} key="sorter">
              {ascend}
              {descend}
            </div>
          );
          customHeaderCell = col => {
            let colProps = {};
            // Get original first
            if (column.customHeaderCell) {
              colProps = {
                ...column.customHeaderCell(col),
              };
            }
            colProps.on = colProps.on || {};
            // Add sorter logic
            const onHeaderCellClick = colProps.on.click;
            colProps.on.click = (...args) => {
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
            <div key="title" class={sortButton ? `${prefixCls}-column-sorters` : undefined}>
              {title}
              {sortButton}
            </div>,
            filterDropdown,
          ],
          customHeaderCell,
        };
      });
    },
    renderColumnTitle(title) {
      const { sFilters: filters, sSortOrder: sortOrder } = this.$data;
      // https://github.com/ant-design/ant-design/issues/11246#issuecomment-405009167
      if (title instanceof Function) {
        return title({
          filters,
          sortOrder,
        });
      }
      return title;
    },

    handleShowSizeChange(current, pageSize) {
      const pagination = this.sPagination;
      pagination.onShowSizeChange(current, pageSize);
      const nextPagination = {
        ...pagination,
        pageSize,
        current,
      };
      this.setState({ sPagination: nextPagination });
      this.$emit(
        'change',
        ...this.prepareParamsArguments({
          ...this.$data,
          sPagination: nextPagination,
        }),
      );
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
      const total = pagination.total || this.getLocalData().length;
      const { class: cls, style, onChange, onShowSizeChange, ...restProps } = pagination; // eslint-disable-line
      const paginationProps = mergeProps({
        key: `pagination-${paginationPosition}`,
        class: classNames(cls, `${prefixCls}-pagination`),
        props: {
          ...restProps,
          total,
          size,
          current: this.getMaxCurrent(total),
        },
        style,
        on: {
          change: this.handlePageChange,
          showSizeChange: this.handleShowSizeChange,
        },
      });
      return total > 0 && (position === paginationPosition || position === 'both') ? (
        <Pagination {...paginationProps} />
      ) : null;
    },

    // Get pagination, filters, sorter
    prepareParamsArguments(state) {
      const pagination = { ...state.sPagination };
      // remove useless handle function in Table.onChange
      delete pagination.onChange;
      delete pagination.onShowSizeChange;
      const filters = state.sFilters;
      const sorter = {};
      if (state.sSortColumn && state.sSortOrder) {
        sorter.column = state.sSortColumn;
        sorter.order = state.sSortOrder;
        sorter.field = state.sSortColumn.dataIndex;
        sorter.columnKey = this.getColumnKey(state.sSortColumn);
      }
      const extra = {
        currentDataSource: this.getLocalData(state),
      };

      return [pagination, filters, sorter, extra];
    },

    findColumn(myKey) {
      let column;
      treeMap(this.columns, c => {
        if (this.getColumnKey(c) === myKey) {
          column = c;
        }
      });
      return column;
    },

    getCurrentPageData() {
      let data = this.getLocalData();
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
        data = data.filter((_, i) => {
          return i >= (current - 1) * pageSize && i < current * pageSize;
        });
      }
      return data;
    },

    getFlatData() {
      return flatArray(this.getLocalData(null, false));
    },

    getFlatCurrentPageData(childrenColumnName) {
      return flatArray(this.getCurrentPageData(), childrenColumnName);
    },

    recursiveSort(data, sorterFn) {
      const { childrenColumnName = 'children' } = this;
      return data.sort(sorterFn).map(item =>
        item[childrenColumnName]
          ? {
              ...item,
              [childrenColumnName]: this.recursiveSort(item[childrenColumnName], sorterFn),
            }
          : item,
      );
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
        data = this.recursiveSort(data, sorterFn);
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

    createComponents(components = {}, prevComponents) {
      const bodyRow = components && components.body && components.body.row;
      const preBodyRow = prevComponents && prevComponents.body && prevComponents.body.row;
      if (!this.row || bodyRow !== preBodyRow) {
        this.row = createBodyRow(bodyRow);
      }
      this.customComponents = {
        ...components,
        body: {
          ...components.body,
          row: this.row,
        },
      };
    },

    renderTable(prefixCls, renderEmpty, dropdownPrefixCls, contextLocale, loading) {
      const locale = { ...contextLocale, ...this.locale };
      const { showHeader, ...restProps } = getOptionProps(this);
      const data = this.getCurrentPageData();
      const expandIconAsCell = this.expandedRowRender && this.expandIconAsCell !== false;

      const mergedLocale = { ...contextLocale, ...locale };
      if (!locale || !locale.emptyText) {
        mergedLocale.emptyText = renderEmpty(h, 'Table');
      }

      const classString = classNames({
        [`${prefixCls}-${this.size}`]: true,
        [`${prefixCls}-bordered`]: this.bordered,
        [`${prefixCls}-empty`]: !data.length,
        [`${prefixCls}-without-column-header`]: !showHeader,
      });

      let columns = this.renderRowSelection(prefixCls, mergedLocale);
      columns = this.renderColumnsDropdown(prefixCls, dropdownPrefixCls, columns, mergedLocale);
      columns = columns.map((column, i) => {
        const newColumn = { ...column };
        newColumn.key = this.getColumnKey(newColumn, i);
        return newColumn;
      });
      let expandIconColumnIndex = columns[0] && columns[0].key === 'selection-column' ? 1 : 0;
      if ('expandIconColumnIndex' in restProps) {
        expandIconColumnIndex = restProps.expandIconColumnIndex;
      }
      const vcTableProps = {
        key: 'table',
        props: {
          ...restProps,
          customRow: (record, index) => this.onRow(prefixCls, record, index),
          components: this.customComponents,
          prefixCls,
          data,
          columns,
          showHeader,
          expandIconColumnIndex,
          expandIconAsCell,
          emptyText: !(loading.props && loading.props.spinning) && mergedLocale.emptyText,
        },
        on: this.$listeners,
        class: classString,
      };
      return <VcTable {...vcTableProps} />;
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, dropdownPrefixCls: customizeDropdownPrefixCls } = this;
    const data = this.getCurrentPageData();

    let loading = this.loading;
    if (typeof loading === 'boolean') {
      loading = {
        props: {
          spinning: loading,
        },
      };
    } else {
      loading = {
        props: { ...loading },
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
          this.renderTable(prefixCls, renderEmpty, dropdownPrefixCls, locale, loading)
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
      class:
        loading.props && loading.props.spinning
          ? `${paginationPatchClass} ${prefixCls}-spin-holder`
          : '',
    };
    return (
      <div class={classNames(`${prefixCls}-wrapper`)}>
        <Spin {...spinProps}>
          {this.renderPagination(prefixCls, 'top')}
          {table}
          {this.renderPagination(prefixCls, 'bottom')}
        </Spin>
      </div>
    );
  },
};
