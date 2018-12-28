import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** ATable Layout Component */
export declare class ATable extends AntdVueComponent {
  bordered: boolean

  childrenColumnName: string[]

  columns: Array<any>

  components: object

  dataSource: any[]

  defaultExpandAllRows: boolean

  defaultExpandedRowKeys: string[]

  expandedRowKeys: string[]

  expandedRowRender: (record: any, index: number, indent: any, expanded: any) => VNode

  expandRowByClick: boolean

  footer: (currentPageData: any) => any| VNode

  indentSize: number

  loading: boolean | object

  locale: object

  pagination: object | boolean

  rowClassName: (record: any, index: number) => string

  rowKey: (record: any) => string | string

  rowSelection: object

  scroll: { x: number | true, y: number }

  showHeader: boolean

  size: AntdVueComponentSize

  static title: (currentPageData: any) => any| VNode

  static customHeaderRow: (column: any, index: number) => any

  static customRow: (record: any, index: number) => any

  expandedRowsChange: (expandedRows: any) => void

  change: (pagination: any, filters: any, sorter: any) => void

  expand: (expanded: any, record: any) => void
}

/** AColumn Layout Component */
export declare class AColumn {
  align: 'left' | 'right' | 'center'

  colSpan?: number

  dataIndex: string

  filterDropdown?: VNode

  filterDropdownVisible?: boolean

  filtered?: boolean

  filteredValue?: string[]

  filterIcon?: VNode

  filterMultiple?: boolean

  filters?: object[]

  fixed?: boolean | string

  key?: string

  customRender?: (text: any, record: object, index: number) => any | VNode

  sorter?: Function | boolean

  sortOrder?: boolean | string

  title?: string | VNode

  width?: string | number

  customCell?: (record: object) => any

  customHeaderCell?: (column: any) => any

  onFilter?: Function

  onFilterDropdownVisibleChange?: (visible: boolean) => any

  slots?: object

  scopedSlots?: object
}

/** AColumn Layout Component */
export declare class AColumnGroup extends AntdVueComponent {
  title: string | VNode

  slots: object
}

interface rowSelection {
  columnWidth: string | number

  columnTitle: string | VNode

  fixed: boolean

  getCheckboxProps: (record: any) => any

  hideDefaultSelections: boolean

  selectedRowKeys: string[]

  selections: object[] | boolean

  type: 'checkbox' | 'radio'

  onChange: (selectedRowKeys: string[], selectedRows: string[]) => void

  onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => void

  onSelectAll: (selected: any, selectedRows: any, changeRows: any) => void

  onSelectInvert: (selectedRows: any) => void
}
