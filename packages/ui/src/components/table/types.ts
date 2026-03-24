import type { CSSProperties, HTMLAttributes, InjectionKey, Ref, VNode } from 'vue'
import type { Slot, ScopedSlot } from '@/utils/types'
import type { PaginationProps } from '../pagination/types'
import type { SpinProps } from '../spin/types'
import type { CheckboxProps } from '../checkbox/types'

// ==================== Common ====================

export type Key = string | number

export type SortOrder = 'ascend' | 'descend' | null

export type FilterValue = (string | number | boolean)[]

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type TableLayout = 'auto' | 'fixed'

export type RowClassName<T = any> = string | ((record: T, index: number, indent: number) => string)

export type GetRowKey<T = any> = string | ((record: T, index: number) => Key)

// ==================== Column ====================

export interface ColumnFilterItem {
  text: string | VNode
  value: string | number | boolean
  children?: ColumnFilterItem[]
}

export interface FilterDropdownProps<T = any> {
  selectedKeys: Key[]
  setSelectedKeys: (keys: Key[]) => void
  confirm: (params?: { closeDropdown?: boolean }) => void
  clearFilters?: (params?: { confirm?: boolean; closeDropdown?: boolean }) => void
  filters?: ColumnFilterItem[]
  visible: boolean
  close: () => void
  column: ColumnType<T>
}

export interface ColumnType<T = any> {
  /** Column header title */
  title?: string | VNode | ((props: { sortOrder: SortOrder; sortColumn: ColumnType<T>; filters: Record<string, FilterValue | null> }) => VNode | string)
  /** Unique column key */
  key?: Key
  /** Path to data in record (supports 'a.b' or ['a', 'b']) */
  dataIndex?: string | number | (string | number)[]
  /** Column width */
  width?: number | string
  /** Minimum column width */
  minWidth?: number
  /** Maximum column width */
  maxWidth?: number
  /** Custom cell render function */
  customRender?: (opt: {
    value: any
    text: any
    record: T
    index: number
    column: ColumnType<T>
  }) => VNode | string | number | null | undefined
  /** Cell alignment */
  align?: 'left' | 'center' | 'right'
  /** Text overflow ellipsis */
  ellipsis?: boolean | { showTitle?: boolean }
  /** Fixed column position */
  fixed?: 'left' | 'right' | boolean
  /** Custom CSS class for column */
  className?: string
  /** Custom cell HTML attributes (including colSpan/rowSpan for merge) */
  customCell?: (record: T, index: number, column: ColumnType<T>) => HTMLAttributes & { colSpan?: number; rowSpan?: number }
  /** Custom header cell HTML attributes */
  customHeaderCell?: (column: ColumnType<T>) => HTMLAttributes
  /** Column colSpan */
  colSpan?: number
  /** Column rowSpan (for header merge) */
  rowSpan?: number
  /** Responsive breakpoints to show column */
  responsive?: Breakpoint[]

  // Sorting
  /** Sort function or config */
  sorter?: boolean | CompareFn<T> | { compare?: CompareFn<T>; multiple?: number }
  /** Controlled sort order */
  sortOrder?: SortOrder
  /** Default sort order */
  defaultSortOrder?: SortOrder
  /** Available sort directions for this column */
  sortDirections?: SortOrder[]

  // Filtering
  /** Filter options */
  filters?: ColumnFilterItem[]
  /** Controlled filtered values */
  filteredValue?: FilterValue | null
  /** Default filtered values */
  defaultFilteredValue?: FilterValue | null
  /** Allow multiple filter selection */
  filterMultiple?: boolean
  /** Filter UI mode */
  filterMode?: 'menu' | 'tree'
  /** Enable filter search */
  filterSearch?: boolean | ((input: string, record: ColumnFilterItem) => boolean)
  /** Custom filter dropdown render */
  filterDropdown?: (props: FilterDropdownProps<T>) => VNode
  /** Controlled filter dropdown visibility */
  filterDropdownOpen?: boolean
  /** Filter dropdown visibility change */
  onFilterDropdownOpenChange?: (visible: boolean) => void
  /** Filter function applied to each record */
  onFilter?: (value: string | number | boolean, record: T) => boolean
  /** Custom filter icon render */
  filterIcon?: (opt: { filtered: boolean; column: ColumnType<T> }) => VNode
  /** Whether column is actively filtered (visual indicator) */
  filtered?: boolean
  /** Enable custom filter dropdown slot */
  customFilterDropdown?: boolean
  /** Allow column resize */
  resizable?: boolean
}

export type CompareFn<T = any> = (a: T, b: T, sortOrder?: SortOrder) => number

export interface ColumnGroupType<T = any> extends Omit<ColumnType<T>, 'dataIndex' | 'customRender'> {
  children: ColumnsType<T>
}

export type ColumnsType<T = any> = (ColumnType<T> | ColumnGroupType<T>)[]

/** Sentinel object — place in columns array to position the expand column */
export const EXPAND_COLUMN = Symbol('EXPAND_COLUMN') as unknown as ColumnType

/** Sentinel object — place in columns array to position the selection column */
export const SELECTION_COLUMN = Symbol('SELECTION_COLUMN') as unknown as ColumnType

// ==================== Row Selection ====================

export const SELECTION_ALL = 'SELECT_ALL' as const
export const SELECTION_INVERT = 'SELECT_INVERT' as const
export const SELECTION_NONE = 'SELECT_NONE' as const

export interface SelectionItem {
  key: string
  text: string | VNode
  onSelect?: (changeableRowKeys: Key[]) => void
}

export interface TableRowSelection<T = any> {
  /** Selection type */
  type?: 'checkbox' | 'radio'
  /** Controlled selected row keys (v-model:selectedRowKeys) */
  selectedRowKeys?: Key[]
  /** Default selected row keys */
  defaultSelectedRowKeys?: Key[]
  /** Callback when selection changes */
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void
  /** Customize checkbox/radio props per row */
  getCheckboxProps?: (record: T) => Partial<CheckboxProps>
  /** Callback when a single row is selected */
  onSelect?: (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void
  /** Callback when multiple rows selected (e.g., shift-click) */
  onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void
  /** Callback when select-none triggered */
  onSelectNone?: () => void
  /** Selection menu (true = default menu, or custom items; use SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE constants) */
  selections?: boolean | (SelectionItem | typeof SELECTION_ALL | typeof SELECTION_INVERT | typeof SELECTION_NONE)[]
  /** Hide "select all" checkbox in header */
  hideSelectAll?: boolean
  /** Disable parent-child check association */
  checkStrictly?: boolean
  /** Keep keys for removed rows */
  preserveSelectedRowKeys?: boolean
  /** Selection column width */
  columnWidth?: string | number
  /** Selection column header */
  columnTitle?: string | VNode
  /** Fixed position for selection column */
  fixed?: 'left' | 'right' | boolean
  /** Custom render for selection cell */
  renderCell?: (value: boolean, record: T, index: number, originNode: VNode) => VNode
}

// ==================== Sorting ====================

export interface SorterResult<T = any> {
  column?: ColumnType<T>
  order?: SortOrder
  field?: string | number | (string | number)[]
  columnKey?: Key
}

// ==================== Pagination ====================

export interface TablePaginationConfig extends PaginationProps {
  position?: ('topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight')[]
  class?: string
  style?: CSSProperties
}

// ==================== Expandable ====================

export interface ExpandableConfig<T = any> {
  expandedRowKeys?: Key[]
  defaultExpandedRowKeys?: Key[]
  expandedRowRender?: (opt: { record: T; index: number; indent: number; expanded: boolean }) => VNode
  expandRowByClick?: boolean
  expandIcon?: (opt: { expanded: boolean; record: T; expandable: boolean; onExpand: (record: T, event: MouseEvent) => void }) => VNode
  defaultExpandAllRows?: boolean
  expandColumnWidth?: number | string
  expandFixed?: 'left' | 'right' | boolean
  showExpandColumn?: boolean
  expandedRowClassName?: (record: T, index: number, indent: number) => string
  childrenColumnName?: string
  rowExpandable?: (record: T) => boolean
  indentSize?: number
}

// ==================== Summary ====================

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom'
}

export interface SummaryCellProps {
  index: number
  colSpan?: number
  rowSpan?: number
  align?: 'left' | 'center' | 'right'
}

// ==================== Locale ====================

export interface TableLocale {
  filterTitle?: string
  filterConfirm?: string | VNode
  filterReset?: string | VNode
  filterEmptyText?: string | VNode
  filterCheckall?: string | VNode
  filterSearchPlaceholder?: string
  emptyText?: string | VNode
  selectAll?: string | VNode
  selectNone?: string | VNode
  selectInvert?: string | VNode
  sortTitle?: string
  expand?: string
  collapse?: string
  triggerDesc?: string
  triggerAsc?: string
  cancelSort?: string
}

export const defaultTableLocale: TableLocale = {
  filterTitle: 'Filter menu',
  filterConfirm: 'OK',
  filterReset: 'Reset',
  filterEmptyText: 'No filters',
  filterCheckall: 'Select all items',
  filterSearchPlaceholder: 'Search in filters',
  emptyText: 'No data',
  selectAll: 'Select current page',
  selectNone: 'Clear all data',
  selectInvert: 'Invert current page',
  sortTitle: 'Sort',
  expand: 'Expand row',
  collapse: 'Collapse row',
  triggerDesc: 'Click to sort descending',
  triggerAsc: 'Click to sort ascending',
  cancelSort: 'Click to cancel sorting',
}

// ==================== Scroll ====================

export interface TableScroll {
  /** Horizontal scroll width (set to enable horizontal scroll / fixed columns) */
  x?: number | string | true
  /** Vertical scroll height (set to enable fixed header) */
  y?: number | string
  /** Scroll to first row on page change */
  scrollToFirstRowOnChange?: boolean
}

export interface TableSticky {
  offsetHeader?: number
  offsetSummary?: number
  getContainer?: () => HTMLElement
}

// ==================== Table Props ====================

export interface TableProps<T = any> {
  /** Data array */
  dataSource?: T[]
  /** Column definitions */
  columns?: ColumnsType<T>
  /** Unique key field or getter */
  rowKey?: GetRowKey<T>
  /** Pagination config, false to disable */
  pagination?: false | TablePaginationConfig
  /** Loading state */
  loading?: boolean | SpinProps
  /** Show table border */
  bordered?: boolean
  /** Table size */
  size?: 'large' | 'middle' | 'small'
  /** Table locale strings */
  locale?: TableLocale
  /** CSS table-layout */
  tableLayout?: TableLayout
  /** Show table header */
  showHeader?: boolean
  /** Title section */
  title?: (data: T[]) => VNode
  /** Footer section */
  footer?: (data: T[]) => VNode
  /** Scroll configuration */
  scroll?: TableScroll
  /** Sticky header / summary */
  sticky?: boolean | TableSticky
  /** Custom row class */
  rowClassName?: RowClassName<T>
  /** Custom row HTML attributes */
  customRow?: (record: T, index: number) => HTMLAttributes
  /** Custom header row HTML attributes */
  customHeaderRow?: (columns: ColumnType<T>[], rowIndex: number) => HTMLAttributes
  /** Transform cell text content */
  transformCellText?: (opt: { text: any; column: ColumnType<T>; record: T; index: number }) => any
  /** Available sort directions */
  sortDirections?: SortOrder[]
  /** Show sort tooltip */
  showSorterTooltip?: boolean
  /** Row selection config */
  rowSelection?: TableRowSelection<T>
  /** Controlled expanded row keys */
  expandedRowKeys?: Key[]
  /** Default expanded row keys */
  defaultExpandedRowKeys?: Key[]
  /** Expanded row render */
  expandedRowRender?: ExpandableConfig<T>['expandedRowRender']
  /** Expand on row click */
  expandRowByClick?: boolean
  /** Custom expand icon */
  expandIcon?: ExpandableConfig<T>['expandIcon']
  /** Expand all rows on mount */
  defaultExpandAllRows?: boolean
  /** Expand column width */
  expandColumnWidth?: number | string
  /** Fixed expand column */
  expandFixed?: 'left' | 'right' | boolean
  /** Show expand column */
  showExpandColumn?: boolean
  /** Custom expanded row class */
  expandedRowClassName?: ExpandableConfig<T>['expandedRowClassName']
  /** Children field for tree data */
  childrenColumnName?: string
  /** Whether row is expandable */
  rowExpandable?: (record: T) => boolean
  /** Tree indent size in px */
  indentSize?: number
  /** Get popup container for filter dropdown */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
}

export const tableDefaultProps = {
  rowKey: 'key' as const,
  showHeader: true,
  sortDirections: ['ascend', 'descend'] as SortOrder[],
  showSorterTooltip: true,
  childrenColumnName: 'children',
  indentSize: 15,
  showExpandColumn: true,
} as const

// ==================== Emits ====================

export interface TableEmits<T = any> {
  (e: 'change', pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<T> | SorterResult<T>[], extra: { currentDataSource: T[]; action: 'paginate' | 'sort' | 'filter' }): void
  (e: 'update:expandedRowKeys', keys: Key[]): void
  (e: 'expand', expanded: boolean, record: T): void
  (e: 'expandedRowsChange', keys: Key[]): void
  (e: 'resizeColumn', width: number, column: ColumnType<T>): void
}

// ==================== Slots ====================

export interface TableSlots<T = any> {
  /** Title section above table */
  title?: ScopedSlot<{ data: T[] }>
  /** Footer section below table */
  footer?: ScopedSlot<{ data: T[] }>
  /** Empty state content */
  emptyText?: Slot
  /** Summary rows */
  summary?: ScopedSlot<{ data: T[] }>
  /** Custom body cell content */
  bodyCell?: ScopedSlot<{ text: any; value: any; record: T; index: number; column: ColumnType<T> }>
  /** Custom header cell content */
  headerCell?: ScopedSlot<{ title: any; column: ColumnType<T> }>
  /** Expanded row content */
  expandedRowRender?: ScopedSlot<{ record: T; index: number; indent: number; expanded: boolean }>
  /** Expand column header */
  expandColumnTitle?: Slot
  /** Custom expand icon */
  expandIcon?: ScopedSlot<{ expanded: boolean; record: T; expandable: boolean; onExpand: (record: T, event: MouseEvent) => void }>
  /** Custom filter icon */
  customFilterIcon?: ScopedSlot<{ filtered: boolean; column: ColumnType<T> }>
  /** Custom filter dropdown */
  customFilterDropdown?: ScopedSlot<FilterDropdownProps<T>>
}

// ==================== Internal Types ====================

/** Internal resolved column with computed key */
export interface InternalColumnType<T = any> extends ColumnType<T> {
  _key: Key
  _fixed?: 'left' | 'right'
  _lastFixedLeft?: boolean
  _firstFixedRight?: boolean
  _fixedLeft?: number
  _fixedRight?: number
}

export interface InternalColumnGroupType<T = any> extends ColumnGroupType<T> {
  _key: Key
}

export type InternalColumnsType<T = any> = (InternalColumnType<T> | InternalColumnGroupType<T>)[]

/** Flattened row for rendering */
export interface FlattenedRow<T = any> {
  record: T
  key: Key
  index: number
  indent: number
  parentKey?: Key
  hasChildren: boolean
  expanded: boolean
}

// ==================== Context ====================

export interface TableContext {
  tableLayout: Ref<TableLayout>
  scroll: Ref<TableScroll | undefined>
  bordered: Ref<boolean>
  size: Ref<'large' | 'middle' | 'small'>
  expandIconColumnIndex: Ref<number>
}

export const tableContextKey: InjectionKey<TableContext> =
  Symbol('tableContext')

export interface SummaryContext {
  fixed: Ref<boolean | 'top' | 'bottom' | undefined>
  stickyOffsets: Ref<{ left: number[]; right: number[] }>
}

export const summaryContextKey: InjectionKey<SummaryContext> =
  Symbol('summaryContext')
