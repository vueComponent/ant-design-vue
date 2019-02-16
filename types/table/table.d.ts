// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Spin } from '../spin';
import { ScopedSlot, VNode } from 'vue/types/vnode';
import { Pagination } from '../pagination';
import { Column } from './column';
import { ColumnGroup } from './column-group';

export declare class PaginationConfig extends Pagination {
  position: 'top' | 'bottom' | 'both';
}

export interface customSelection {
  /**
   * Key
   * @description Unique key of this selection
   * @default undefined
   * @type string
   */
  key?: string;

  /**
   * Text
   * @description Display text of this selection
   * @default undefined
   * @type string | VNode
   */
  text?: string | VNode;

  /**
   * On Select
   * @description Callback executed when this selection is clicked
   * @default undefined
   * @type Function
   */
  onSelect?: (changeableRowKeys?: any) => any;
}

export interface TableRowSelection {
  /**
   * checkbox or radio
   * @default 'checkbox'
   * @type string
   */
  type?: 'checkbox' | 'radio';

  /**
   * Controlled selected row keys
   * @type string[]
   */
  selectedRowKeys?: string[];

  /**
   * Get Checkbox or Radio props
   * @type Function
   */
  getCheckboxProps?: (record: any) => any;

  /**
   * Custom selection config, only displays default selections when set to true
   * @type boolean | object[]
   */
  selections?: boolean | customSelection[];

  /**
   * Remove the default Select All and Select Invert selections
   * @default false
   * @type boolean
   */
  hideDefaultSelections?: boolean;

  /**
   * Fixed selection column on the left
   * @type boolean
   */
  fixed?: boolean;

  /**
   * Set the width of the selection column
   * @type string | number
   */
  columnWidth?: string | number;

  /**
   * Set the title of the selection column
   * @type string | VNode
   */
  columnTitle?: string | VNode;

  /**
   * Callback executed when selected rows change
   * @type Function
   */
  onChange?: (selectedRowKeys: Array<string | number>, selectedRows: object[]) => any;

  /**
   * Callback executed when select/deselect one row
   * @type Function
   */
  onSelect?: (record: any, selected: boolean, selectedRows: object[], nativeEvent: Event) => any;

  /**
   * Callback executed when select/deselect all rows
   * @type Function
   */
  onSelectAll?: (selected: boolean, selectedRows: object[], changeRows: object[]) => any;

  /**
   * Callback executed when row selection is inverted
   * @type Function
   */
  onSelectInvert?: (selectedRows: Object[]) => any;
}

export declare class Table extends AntdComponent {
  static Column: typeof Column;
  static ColumnGroup: typeof ColumnGroup;

  /**
   * Whether to show all table borders
   * @default false
   * @type  boolean
   */
  bordered: boolean;

  /**
   * The column contains children to display
   * @default 'children'
   * @type string | string[]
   */
  childrenColumnName: string | string[];

  /**
   * Columns of table
   * @type any
   */
  columns: any;

  /**
   * Override default table elements
   * @type object
   */
  components: object;

  /**
   * Data record array to be displayed
   * @type any
   */
  dataSource: any;

  /**
   * Expand all rows initially
   * @default false
   * @type boolean
   */
  defaultExpandAllRows: boolean;

  /**
   * Initial expanded row keys
   * @type string[]
   */
  defaultExpandedRowKeys: string[];

  /**
   * Current expanded row keys
   * @type string[]
   */
  expandedRowKeys: string[];

  /**
   * Expanded container render for each row
   * @type Function
   */
  expandedRowRender: (record: any, index: number, indent: number, expanded: boolean) => any;

  /**
   * Customize row expand Icon.
   * @type Function | ScopedSlot
   */
  expandIcon: Function | ScopedSlot;

  /**
   * Whether to expand row by clicking anywhere in the whole row
   * @default false
   * @type boolean
   */
  expandRowByClick: boolean;

  /**
   * Table footer renderer
   * @type Function | ScopedSlot
   */
  footer: Function | ScopedSlot;

  /**
   * Indent size in pixels of tree data
   * @default 15
   * @type number
   */
  indentSize: number;

  /**
   * Loading status of table
   * @default false
   * @type boolean | object
   */
  loading: boolean | Spin;

  /**
   * i18n text including filter, sort, empty text, etc
   * @default { filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }
   * @type object
   */
  locale: object;

  /**
   * Pagination config or [Pagination] (/components/pagination/), hide it by setting it to false
   * @type boolean | PaginationConfig
   */
  pagination: boolean | PaginationConfig;

  /**
   * Row's className
   * @type Function
   */
  rowClassName: (record: any, index: number) => string;

  /**
   * Row's unique key, could be a string or function that returns a string
   * @default 'key'
   * @type string | Function
   */
  rowKey: string | Function;

  /**
   * Row selection config
   * @type object
   */
  rowSelection: TableRowSelection;

  /**
   * Set horizontal or vertical scrolling, can also be used to specify the width and height of the scroll area.
   * It is recommended to set a number for x, if you want to set it to true,
   * you need to add style .ant-table td { white-space: nowrap; }.
   * @type object
   */
  scroll: { x: number | true; y: number };

  /**
   * Whether to show table header
   * @default true
   * @type boolean
   */
  showHeader: boolean;

  /**
   * Size of table
   * @default 'default'
   * @type string
   */
  size: 'default' | 'middle' | 'small' | 'large';

  /**
   * Table title renderer
   * @type Function | ScopedSlot
   */
  title: Function | ScopedSlot;

  /**
   * Set props on per header row
   * @type Function
   */
  customHeaderRow: (
    column: any,
    index: number,
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };

  /**
   * Set props on per row
   * @type Function
   */
  customRow: (
    record: any,
    index: number,
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };
}
