
import VcTable from '../vc-table'
import classNames from 'classnames'
import Pagination from '../pagination'
import Icon from '../icon'
import Spin from '../spin'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'
import warning from '../_util/warning'
import FilterDropdown from './filterDropdown'
import createStore from './createStore'
import SelectionBox from './SelectionBox'
import SelectionCheckboxAll from './SelectionCheckboxAll'
import Column from './Column'
import ColumnGroup from './ColumnGroup'
import createBodyRow from './createBodyRow'
import { flatArray, treeMap, flatFilter } from './util'
import { initDefaultProps, mergeProps, getOptionProps } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import {
  TableProps,
} from './interface'

function noop () {
}

function stopPropagation (e) {
  e.stopPropagation()
  if (e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation()
  }
}

const defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop,
}

/**
 * Avoid creating new object, so that parent component's shouldComponentUpdate
 * can works appropriately。
 */
const emptyObject = {}

export default {
  name: 'Table',
  Column,
  ColumnGroup,
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
    showHeader: true,
  }),

  // CheckboxPropsCache: {
  //   [key: string]: any;
  // };
  // store: Store;
  // columns: ColumnProps<T>[];
  // components: TableComponents;

  data () {
    // this.columns = props.columns || normalizeColumns(props.children)

    this.createComponents(this.components)
    this.CheckboxPropsCache = {}

    this.store = createStore({
      selectedRowKeys: (this.rowSelection || {}).selectedRowKeys || [],
      selectionDirty: false,
    })
    return {
      ...this.getDefaultSortOrder(this.columns),
      // 减少状态
      sFilters: this.getFiltersFromColumns(),
      sPagination: this.getDefaultPagination(this.$props),
    }
  },
  watch: {
    pagination (val) {
      this.setState(previousState => {
        const newPagination = {
          ...defaultPagination,
          ...previousState.sPagination,
          ...val,
        }
        newPagination.current = newPagination.current || 1
        newPagination.pageSize = newPagination.pageSize || 10
        return { sPagination: val !== false ? newPagination : emptyObject }
      })
    },
    rowSelection: {
      handler: (val) => {
        if (val &&
          'selectedRowKeys' in val) {
          this.store.setState({
            selectedRowKeys: val.selectedRowKeys || [],
          })
          const { rowSelection } = this.props
          if (rowSelection && (
            val.getCheckboxProps !== rowSelection.getCheckboxProps
          )) {
            this.CheckboxPropsCache = {}
          }
        }
      },
      deep: true,
    },
    dataSource (val) {
      this.store.setState({
        selectionDirty: false,
      })
      this.CheckboxPropsCache = {}
    },
    columns (val) {
      if (this.getSortOrderColumns(val).length > 0) {
        const sortState = this.getSortStateFromColumns(val)
        if (sortState.sSortColumn !== this.sSortColumn ||
            sortState.sSortOrder !== this.sSortOrder) {
          this.setState(sortState)
        }
      }

      const filteredValueColumns = this.getFilteredValueColumns(val)
      if (filteredValueColumns.length > 0) {
        const filtersFromColumns = this.getFiltersFromColumns(val)
        const newFilters = { ...this.state.filters }
        Object.keys(filtersFromColumns).forEach(key => {
          newFilters[key] = filtersFromColumns[key]
        })
        if (this.isFiltersChanged(newFilters)) {
          this.setState({ filters: newFilters })
        }
      }
    },
    components (val, preVal) {
      this.createComponents(val, preVal)
    },
  },
  methods: {
    getCheckboxPropsByItem (item, index) {
      const { rowSelection = {}} = this
      if (!rowSelection.getCheckboxProps) {
        return {}
      }
      const key = this.getRecordKey(item, index)
      // Cache checkboxProps
      if (!this.CheckboxPropsCache[key]) {
        this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps(item)
      }
      return this.CheckboxPropsCache[key]
    },

    getDefaultSelection () {
      const { rowSelection = {}} = this
      if (!rowSelection.getCheckboxProps) {
        return []
      }
      return this.getFlatData()
        .filter((item, rowIndex) => this.getCheckboxPropsByItem(item, rowIndex).defaultChecked)
        .map((record, rowIndex) => this.getRecordKey(record, rowIndex))
    },

    getDefaultPagination (props) {
      const pagination = props.pagination || {}
      return this.hasPagination(props)
        ? {
          ...defaultPagination,
          ...pagination,
          current: pagination.defaultCurrent || pagination.current || 1,
          pageSize: pagination.defaultPageSize || pagination.pageSize || 10,
        } : {}
    },

    onRow  (record, index) {
      const { prefixCls, customRow } = this
      const custom = customRow ? customRow(record, index) : {}
      return mergeProps(custom, {
        props: {
          prefixCls,
          store: this.store,
          rowKey: this.getRecordKey(record, index),
        },
      })
    },

    setSelectedRowKeys (selectedRowKeys, { selectWay, record, checked, changeRowKeys }) {
      const { rowSelection = {}, $listeners: {
        rowSelectionChange,
        rowSelectionSelect,
        rowSelectionSelectAll,
        rowSelectionSelectInvert,
      }} = this
      if (rowSelection && !('selectedRowKeys' in rowSelection)) {
        this.store.setState({ selectedRowKeys })
      }
      const data = this.getFlatData()
      if (!rowSelectionChange && !rowSelection[selectWay]) {
        return
      }
      const selectedRows = data.filter(
        (row, i) => selectedRowKeys.indexOf(this.getRecordKey(row, i)) >= 0,
      )
      this.$emit('rowSelectionChange', selectedRowKeys, selectedRows)

      if (selectWay === 'onSelect' && rowSelectionSelect) {
        this.$emit('rowSelectionSelect', record, checked, selectedRows)
      } else if (selectWay === 'onSelectAll' && rowSelectionSelectAll) {
        const changeRows = data.filter(
          (row, i) => changeRowKeys.indexOf(this.getRecordKey(row, i)) >= 0,
        )
        this.$emit('rowSelectionSelectAll', checked, selectedRows, changeRows)
      } else if (selectWay === 'onSelectInvert' && rowSelectionSelectInvert) {
        this.$emit('rowSelectionSelectInvert', selectedRowKeys)
      }
    },

    hasPagination () {
      return this.pagination !== false
    },

    isFiltersChanged (filters) {
      let filtersChanged = false
      if (Object.keys(filters).length !== Object.keys(this.sFilters).length) {
        filtersChanged = true
      } else {
        Object.keys(filters).forEach(columnKey => {
          if (filters[columnKey] !== this.sFilters[columnKey]) {
            filtersChanged = true
          }
        })
      }
      return filtersChanged
    },

    getSortOrderColumns (columns) {
      return flatFilter(
        columns || this.columns || [],
        (column) => 'sortOrder' in column,
      )
    },

    getFilteredValueColumns (columns) {
      return flatFilter(
        columns || this.columns || [],
        (column) => typeof column.filteredValue !== 'undefined',
      )
    },

    getFiltersFromColumns (columns) {
      const filters = {}
      this.getFilteredValueColumns(columns).forEach((col) => {
        const colKey = this.getColumnKey(col)
        filters[colKey] = col.filteredValue
      })
      return filters
    },

    getDefaultSortOrder (columns) {
      const definedSortState = this.getSortStateFromColumns(columns)

      const defaultSortedColumn = flatFilter(columns || [], (column) => column.defaultSortOrder != null)[0]

      if (defaultSortedColumn && !definedSortState.sortColumn) {
        return {
          sSortColumn: defaultSortedColumn,
          sSortOrder: defaultSortedColumn.defaultSortOrder,
        }
      }

      return definedSortState
    },

    getSortStateFromColumns (columns) {
      // return first column which sortOrder is not falsy
      const sortedColumn = this.getSortOrderColumns(columns).filter((col) => col.sortOrder)[0]

      if (sortedColumn) {
        return {
          sSortColumn: sortedColumn,
          sSortOrder: sortedColumn.sortOrder,
        }
      }

      return {
        sSortColumn: null,
        sSortOrder: null,
      }
    },

    getSorterFn () {
      const { sSortOrder: sortOrder, sSortColumn: sortColumn } = this
      if (!sortOrder || !sortColumn ||
          typeof sortColumn.sorter !== 'function') {
        return
      }

      return (a, b) => {
        const result = sortColumn.sorter(a, b)
        if (result !== 0) {
          return (sortOrder === 'descend') ? -result : result
        }
        return 0
      }
    },

    toggleSortOrder (order, column) {
      let { sSortOrder: sortOrder, sSortColumn: sortColumn } = this
      // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题
      const isSortColumn = this.isSortColumn(column)
      if (!isSortColumn) { // 当前列未排序
        sortOrder = order
        sortColumn = column
      } else { // 当前列已排序
        if (sortOrder === order) { // 切换为未排序状态
          sortOrder = ''
          sortColumn = null
        } else { // 切换为排序状态
          sortOrder = order
        }
      }
      const newState = {
        sSortOrder: sortOrder,
        sSortColumn: sortColumn,
      }

      // Controlled
      if (this.getSortOrderColumns().length === 0) {
        this.setState(newState)
      }
      this.$emit('change', ...this.prepareParamsArguments({
        ...this.$data,
        ...newState,
      }))
    },

    handleFilter (column, nextFilters) {
      const props = this.$props
      const pagination = { ...this.sPagination }
      const filters = {
        ...this.sFilters,
        [this.getColumnKey(column)]: nextFilters,
      }
      // Remove filters not in current columns
      const currentColumnKeys = []
      treeMap(this.columns, c => {
        if (!c.children) {
          currentColumnKeys.push(this.getColumnKey(c))
        }
      })
      Object.keys(filters).forEach((columnKey) => {
        if (currentColumnKeys.indexOf(columnKey) < 0) {
          delete filters[columnKey]
        }
      })

      if (props.pagination) {
        // Reset current prop
        pagination.current = 1
        pagination.onChange(pagination.current)
      }

      const newState = {
        sPagination: pagination,
        sFilters: {},
      }
      const filtersToSetState = { ...filters }
      // Remove filters which is controlled
      this.getFilteredValueColumns().forEach((col) => {
        const columnKey = this.getColumnKey(col)
        if (columnKey) {
          delete filtersToSetState[columnKey]
        }
      })
      if (Object.keys(filtersToSetState).length > 0) {
        newState.sFilters = filtersToSetState
      }

      // Controlled current prop will not respond user interaction
      if (typeof props.pagination === 'object' && 'current' in (props.pagination)) {
        newState.sPagination = {
          ...pagination,
          current: this.sPagination.current,
        }
      }

      this.setState(newState, () => {
        this.store.setState({
          selectionDirty: false,
        })
        this.$emit('change', ...this.prepareParamsArguments({
          ...this.$data,
          sSelectionDirty: false,
          sFilters: filters,
          sPagination: pagination,
        }))
      })
    },

    handleSelect  (record, rowIndex, e) {
      const checked = e.target.checked
      const defaultSelection = this.store.getState().selectionDirty ? [] : this.getDefaultSelection()
      let selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection)
      const key = this.getRecordKey(record, rowIndex)
      if (checked) {
        selectedRowKeys.push(this.getRecordKey(record, rowIndex))
      } else {
        selectedRowKeys = selectedRowKeys.filter((i) => key !== i)
      }
      this.store.setState({
        selectionDirty: true,
      })
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record,
        checked,
      })
    },

    handleRadioSelect  (record, rowIndex, e) {
      const checked = e.target.checked
      const defaultSelection = this.store.getState().selectionDirty ? [] : this.getDefaultSelection()
      let selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection)
      const key = this.getRecordKey(record, rowIndex)
      selectedRowKeys = [key]
      this.store.setState({
        selectionDirty: true,
      })
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record,
        checked,
      })
    },

    handleSelectRow  (selectionKey, index, onSelectFunc) {
      const data = this.getFlatCurrentPageData()
      const defaultSelection = this.store.getState().selectionDirty ? [] : this.getDefaultSelection()
      const selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection)
      const changeableRowKeys = data
        .filter((item, i) => !this.getCheckboxPropsByItem(item, i).disabled)
        .map((item, i) => this.getRecordKey(item, i))

      const changeRowKeys = []
      let selectWay = ''
      let checked
      // handle default selection
      switch (selectionKey) {
        case 'all':
          changeableRowKeys.forEach(key => {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key)
              changeRowKeys.push(key)
            }
          })
          selectWay = 'onSelectAll'
          checked = true
          break
        case 'removeAll':
          changeableRowKeys.forEach(key => {
            if (selectedRowKeys.indexOf(key) >= 0) {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1)
              changeRowKeys.push(key)
            }
          })
          selectWay = 'onSelectAll'
          checked = false
          break
        case 'invert':
          changeableRowKeys.forEach(key => {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key)
            } else {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1)
            }
            changeRowKeys.push(key)
            selectWay = 'onSelectInvert'
          })
          break
        default:
          break
      }

      this.store.setState({
        selectionDirty: true,
      })
      // when select custom selection, callback selections[n].onSelect
      const { rowSelection } = this
      let customSelectionStartIndex = 2
      if (rowSelection && rowSelection.hideDefaultSelections) {
        customSelectionStartIndex = 0
      }
      if (index >= customSelectionStartIndex && typeof onSelectFunc === 'function') {
        return onSelectFunc(changeableRowKeys)
      }
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: selectWay,
        checked,
        changeRowKeys,
      })
    },

    handlePageChange (current, ...otherArguments) {
      const props = this.$props
      const pagination = { ...this.sPagination }
      if (current) {
        pagination.current = current
      } else {
        pagination.current = pagination.current || 1
      }
      pagination.onChange(pagination.current, ...otherArguments)

      const newState = {
        sPagination: pagination,
      }
      // Controlled current prop will not respond user interaction
      if (props.pagination &&
          typeof props.pagination === 'object' &&
          'current' in (props.pagination)) {
        newState.sPagination = {
          ...pagination,
          current: this.sPagination.current,
        }
      }
      this.setState(newState)

      this.store.setState({
        selectionDirty: false,
      })
      this.$emit('change', ...this.prepareParamsArguments({
        ...this.$data,
        sSelectionDirty: false,
        sPagination: pagination,
      }))
    },

    renderSelectionBox (type) {
      return (_, record, index) => {
        const rowIndex = this.getRecordKey(record, index) // 从 1 开始
        const props = this.getCheckboxPropsByItem(record, index)
        const handleChange = (e) => {
          type === 'radio' ? this.handleRadioSelect(record, rowIndex, e)
            : this.handleSelect(record, rowIndex, e)
        }
        const selectionBoxProps = mergeProps({
          props: {
            type,
            store: this.store,
            rowIndex,
            defaultSelection: this.getDefaultSelection(),
          },
          on: {
            change: handleChange,
          },
        }, props)

        return (
          <span onClick={stopPropagation}>
            <SelectionBox
              {...selectionBoxProps}
            />
          </span>
        )
      }
    },

    getRecordKey (record, index) {
      const rowKey = this.rowKey
      const recordKey = (typeof rowKey === 'function')
        ? rowKey(record, index) : record[rowKey]
      warning(recordKey !== undefined,
        'Each record in dataSource of table should have a unique `key` prop, or set `rowKey` to an unique primary key,',
      )
      return recordKey === undefined ? index : recordKey
    },

    getPopupContainer () {
      return this.$el
    },

    renderRowSelection (locale) {
      const { prefixCls, rowSelection } = this
      const columns = this.columns.concat()
      if (rowSelection) {
        const data = this.getFlatCurrentPageData().filter((item, index) => {
          if (rowSelection.getCheckboxProps) {
            return !this.getCheckboxPropsByItem(item, index).disabled
          }
          return true
        })
        const selectionColumnClass = classNames(`${prefixCls}-selection-column`, {
          [`${prefixCls}-selection-column-custom`]: rowSelection.selections,
        })
        const selectionColumn = {
          key: 'selection-column',
          render: this.renderSelectionBox(rowSelection.type),
          className: selectionColumnClass,
          fixed: rowSelection.fixed,
        }
        if (rowSelection.type !== 'radio') {
          const checkboxAllDisabled = data.every((item, index) => this.getCheckboxPropsByItem(item, index).disabled)
          selectionColumn.title = (
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
              getPopupContainer={this.getPopupContainer}
            />
          )
        }
        if ('fixed' in rowSelection) {
          selectionColumn.fixed = rowSelection.fixed
        } else if (columns.some(column => column.fixed === 'left' || column.fixed === true)) {
          selectionColumn.fixed = 'left'
        }
        if (columns[0] && columns[0].key === 'selection-column') {
          columns[0] = selectionColumn
        } else {
          columns.unshift(selectionColumn)
        }
      }
      return columns
    },

    getColumnKey (column, index) {
      return column.key || column.dataIndex || index
    },

    getMaxCurrent (total) {
      const { current, pageSize } = this.sPagination
      if ((current - 1) * pageSize >= total) {
        return Math.floor((total - 1) / pageSize) + 1
      }
      return current
    },

    isSortColumn (column) {
      const { sSortColumn: sortColumn } = this
      if (!column || !sortColumn) {
        return false
      }
      return this.getColumnKey(sortColumn) === this.getColumnKey(column)
    },

    renderColumnsDropdown (columns, locale) {
      const { prefixCls, dropdownPrefixCls } = this
      const { sSortOrder: sortOrder } = this
      return treeMap(columns, (originColumn, i) => {
        const column = { ...originColumn }
        const key = this.getColumnKey(column, i)
        let filterDropdown
        let sortButton
        if ((column.filters && column.filters.length > 0) || column.filterDropdown) {
          const colFilters = this.sFilters[key] || []
          filterDropdown = (
            <FilterDropdown
              locale={locale}
              column={column}
              selectedKeys={colFilters}
              confirmFilter={this.handleFilter}
              prefixCls={`${prefixCls}-filter`}
              dropdownPrefixCls={dropdownPrefixCls || 'ant-dropdown'}
              getPopupContainer={this.getPopupContainer}
            />
          )
        }
        if (column.sorter) {
          const isSortColumn = this.isSortColumn(column)
          if (isSortColumn) {
            column.className = classNames(column.className, {
              [`${prefixCls}-column-sort`]: sortOrder,
            })
          }
          const isAscend = isSortColumn && sortOrder === 'ascend'
          const isDescend = isSortColumn && sortOrder === 'descend'
          sortButton = (
            <div class={`${prefixCls}-column-sorter`}>
              <span
                class={`${prefixCls}-column-sorter-up ${isAscend ? 'on' : 'off'}`}
                title='↑'
                onClick={() => this.toggleSortOrder('ascend', column)}
              >
                <Icon type='caret-up' />
              </span>
              <span
                class={`${prefixCls}-column-sorter-down ${isDescend ? 'on' : 'off'}`}
                title='↓'
                onClick={() => this.toggleSortOrder('descend', column)}
              >
                <Icon type='caret-down' />
              </span>
            </div>
          )
        }
        column.title = (
          <span>
            {column.title}
            {sortButton}
            {filterDropdown}
          </span>
        )

        if (sortButton || filterDropdown) {
          column.className = classNames(`${prefixCls}-column-has-filters`, column.className)
        }

        return column
      })
    },

    handleShowSizeChange  (current, pageSize) {
      const pagination = this.sPagination
      pagination.onShowSizeChange(current, pageSize)
      const nextPagination = {
        ...pagination,
        pageSize,
        current,
      }
      this.setState({ sPagination: nextPagination })
      this.$emit('change', ...this.prepareParamsArguments({
        ...this.$data,
        sPagination: nextPagination,
      }))
    },

    renderPagination () {
      // 强制不需要分页
      if (!this.hasPagination()) {
        return null
      }
      let size = 'default'
      const { sPagination: pagination } = this
      if (pagination.size) {
        size = pagination.size
      } else if (this.size === 'middle' || this.size === 'small') {
        size = 'small'
      }
      const total = pagination.total || this.getLocalData().length
      const { class: cls, style, onChange, onShowSizeChange, ...restProps } = pagination // eslint-disable-line
      const paginationProps = mergeProps({
        key: 'pagination',
        class: classNames(cls, `${this.prefixCls}-pagination`),
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
      })
      return (total > 0) ? (
        <Pagination
          {...paginationProps}
        />
      ) : null
    },

    // Get pagination, filters, sorter
    prepareParamsArguments (state) {
      const pagination = { ...state.sPagination }
      // remove useless handle function in Table.onChange
      delete pagination.onChange
      delete pagination.onShowSizeChange
      const filters = state.sFilters
      const sorter = {}
      if (state.sSortColumn && state.sSortOrder) {
        sorter.column = state.sSortColumn
        sorter.order = state.sSortOrder
        sorter.field = state.sSortColumn.dataIndex
        sorter.columnKey = this.getColumnKey(state.sSortColumn)
      }
      return [pagination, filters, sorter]
    },

    findColumn (myKey) {
      let column
      treeMap(this.columns, c => {
        if (this.getColumnKey(c) === myKey) {
          column = c
        }
      })
      return column
    },

    getCurrentPageData () {
      let data = this.getLocalData()
      let current
      let pageSize
      const sPagination = this.sPagination
      // 如果没有分页的话，默认全部展示
      if (!this.hasPagination()) {
        pageSize = Number.MAX_VALUE
        current = 1
      } else {
        pageSize = sPagination.pageSize
        current = this.getMaxCurrent(sPagination.total || data.length)
      }

      // 分页
      // ---
      // 当数据量少于等于每页数量时，直接设置数据
      // 否则进行读取分页数据
      if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
        data = data.filter((_, i) => {
          return i >= (current - 1) * pageSize && i < current * pageSize
        })
      }
      return data
    },

    getFlatData () {
      return flatArray(this.getLocalData())
    },

    getFlatCurrentPageData () {
      return flatArray(this.getCurrentPageData())
    },

    recursiveSort (data, sorterFn) {
      const { childrenColumnName = 'children' } = this
      return data.sort(sorterFn).map((item) => (item[childrenColumnName] ? {
        ...item,
        [childrenColumnName]: this.recursiveSort(item[childrenColumnName], sorterFn),
      } : item))
    },

    getLocalData () {
      const { dataSource, sFilters: filters } = this
      let data = dataSource || []
      // 优化本地排序
      data = data.slice(0)
      const sorterFn = this.getSorterFn()
      if (sorterFn) {
        data = this.recursiveSort(data, sorterFn)
      }
      // 筛选
      if (filters) {
        Object.keys(filters).forEach((columnKey) => {
          const col = this.findColumn(columnKey)
          if (!col) {
            return
          }
          const values = filters[columnKey] || []
          if (values.length === 0) {
            return
          }
          const onFilter = col.onFilter
          data = onFilter ? data.filter(record => {
            return values.some(v => onFilter(v, record))
          }) : data
        })
      }
      return data
    },

    createComponents (components = {}, prevComponents) {
      const bodyRow = components && components.body && components.body.row
      const preBodyRow = prevComponents && prevComponents.body && prevComponents.body.row
      if (!this.customComponents || bodyRow !== preBodyRow) {
        this.customComponents = { ...components }
        this.customComponents.body = {
          ...components.body,
          row: createBodyRow(bodyRow),
        }
      }
    },

    renderTable  (contextLocale, loading) {
      const locale = { ...contextLocale, ...this.locale }
      const { prefixCls, showHeader, ...restProps } = getOptionProps(this)
      const data = this.getCurrentPageData()
      const expandIconAsCell = this.expandedRowRender && this.expandIconAsCell !== false

      const classString = classNames({
        [`${prefixCls}-${this.size}`]: true,
        [`${prefixCls}-bordered`]: this.bordered,
        [`${prefixCls}-empty`]: !data.length,
        [`${prefixCls}-without-column-header`]: !showHeader,
      })

      let columns = this.renderRowSelection(locale)
      columns = this.renderColumnsDropdown(columns, locale)
      columns = columns.map((column, i) => {
        const newColumn = { ...column }
        newColumn.key = this.getColumnKey(newColumn, i)
        return newColumn
      })
      let expandIconColumnIndex = (columns[0] && columns[0].key === 'selection-column') ? 1 : 0
      if ('expandIconColumnIndex' in restProps) {
        expandIconColumnIndex = restProps.expandIconColumnIndex
      }
      const vcTableProps = {
        key: 'table',
        props: {
          ...restProps,
          customRow: this.onRow,
          components: this.customComponents,
          prefixCls,
          data,
          columns,
          showHeader,
          expandIconColumnIndex,
          expandIconAsCell,
          emptyText: !(loading.props && loading.spinning) && locale.emptyText,
        },
        on: this.$listeners,
        class: classString,
      }
      return (
        <VcTable
          {...vcTableProps}
        />
      )
    },
  },

  render () {
    const { prefixCls } = this
    const data = this.getCurrentPageData()

    let loading = this.loading
    if (typeof loading === 'boolean') {
      loading = {
        props: {
          spinning: loading,
        },
      }
    }

    const table = (
      <LocaleReceiver
        componentName='Table'
        defaultLocale={defaultLocale.Table}
        children={(locale) => this.renderTable(locale, loading)}
      />
    )

    // if there is no pagination or no data,
    // the height of spin should decrease by half of pagination
    const paginationPatchClass = (this.hasPagination() && data && data.length !== 0)
      ? `${prefixCls}-with-pagination` : `${prefixCls}-without-pagination`
    const spinProps = {
      ...loading,
      class: loading.props && loading.props.spinning ? `${paginationPatchClass} ${prefixCls}-spin-holder` : '',
    }
    return (
      <div
        class={classNames(`${prefixCls}-wrapper`)}
      >
        <Spin
          {...spinProps}
        >
          {table}
          {this.renderPagination()}
        </Spin>
      </div>
    )
  },
}
