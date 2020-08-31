// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { SpinProps } from '../spin';
import { Pagination } from '../pagination';
import { Column, ColumnProps, SortOrder } from './column';
import { ColumnGroup } from './column-group';
import { VNodeChild } from 'vue';

export declare class PaginationConfig extends Pagination {
  position?: 'top' | 'bottom' | 'both';
}

export interface SorterResult<T> {
  column: ColumnProps<T>;
  order: SortOrder;
  field: string;
  columnKey: string;
}

export interface SelectionItem {
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
  text?: string | VNodeChild | JSX.Element;

  /**
   * On Select
   * @description Callback executed when this selection is clicked
   * @default undefined
   * @type Function
   */
  onSelect?: (changeableRowKeys?: string[]) => void;
}

export interface TableCurrentDataSource<T> {
  currentDataSource: T[];
}

export interface TableRowSelection<T> {
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
  getCheckboxProps?: (record: T) => Object;

  /**
   * Custom selection config, only displays default selections when set to true
   * @type boolean | object[]
   */
  selections?: boolean | SelectionItem[];

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
  columnTitle?: VNodeChild | JSX.Element;

  /**
   * Callback executed when selected rows change
   * @type Function
   */
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => any;

  /**
   * Callback executed when select/deselect one row
   * @type FunctionT
   */
  onSelect?: (record: T, selected: boolean, selectedRows: Object[], nativeEvent: Event) => any;

  /**
   * Callback executed when select/deselect all rows
   * @type Function
   */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => any;

  /**
   * Callback executed when row selection is inverted
   * @type Function
   */
  onSelectInvert?: (selectedRows: string[] | number[]) => any;
}

export interface TableCustomRecord<T> {
  record?: T;
  index?: number;
}

export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
  indent?: number;
  expanded?: boolean;
}

export declare class Table<T> extends AntdComponent {
  static Column: typeof Column;
  static ColumnGroup: typeof ColumnGroup;

  $props: AntdProps & {
    /**
     * Whether to show all table borders
     * @default false
     * @type  boolean
     */
    bordered?: boolean;

    /**
     * The column contains children to display
     * @default 'children'
     * @type string | string[]
     */
    childrenColumnName?: string | string[];

    /**
     * Columns of table
     * @type array
     */
    columns?: ColumnProps<T>[];

    /**
     * Override default table elements
     * @type object
     */
    components?: object;

    /**
     * Data record array to be displayed
     * @type array
     */
    dataSource?: T[];

    /**
     * Expand all rows initially
     * @default false
     * @type boolean
     */
    defaultExpandAllRows?: boolean;

    /**
     * Initial expanded row keys
     * @type string[]
     */
    defaultExpandedRowKeys?: string[];

    /**
     * Current expanded row keys
     * @type string[]
     */
    expandedRowKeys?: string[];

    /**
     * Expanded container render for each row
     * @type Function
     */
    expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => VNodeChild | JSX.Element;

    /**
     * Customize row expand Icon.
     * @type Function | VNodeChild
     */
    expandIcon?: Function | VNodeChild | JSX.Element;

    /**
     * Whether to expand row by clicking anywhere in the whole row
     * @default false
     * @type boolean
     */
    expandRowByClick?: boolean;

    /**
     * The index of `expandIcon` which column will be inserted when `expandIconAsCell` is false. default 0
     */
    expandIconColumnIndex?: number;

    /**
     * Table footer renderer
     * @type Function | VNodeChild
     */
    footer?: Function | VNodeChild | JSX.Element;

    /**
     * Indent size in pixels of tree data
     * @default 15
     * @type number
     */
    indentSize?: number;

    /**
     * Loading status of table
     * @default false
     * @type boolean | object
     */
    loading?: boolean | SpinProps | VNodeChild | JSX.Element;

    /**
     * i18n text including filter, sort, empty text, etc
     * @default { filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }
     * @type object
     */
    locale?: object;

    /**
     * Pagination config or [Pagination] (/components/pagination/), hide it by setting it to false
     * @type boolean | PaginationConfig
     */
    pagination?: boolean | PaginationConfig;

    /**
     * Row's className
     * @type Function
     */
    rowClassName?: (record?: TableCustomRecord<T>) => string;

    /**
     * Row's unique key, could be a string or function that returns a string
     * @default 'key'
     * @type string | Function
     */
    rowKey?: string | Function;

    /**
     * Row selection config
     * @type object
     */
    rowSelection?: TableRowSelection<T>;

    /**
     * Set horizontal or vertical scrolling, can also be used to specify the width and height of the scroll area.
     * It is recommended to set a number for x, if you want to set it to true,
     * you need to add style .ant-table td { white-space: nowrap; }.
     * @type object
     */
    scroll?: { x: number | true; y: number };

    /**
     * Whether to show table header
     * @default true
     * @type boolean
     */
    showHeader?: boolean;

    /**
     * Size of table
     * @default 'default'
     * @type string
     */
    size?: 'default' | 'middle' | 'small' | 'large';

    /**
     * Table title renderer
     * @type Function | ScopedSlot
     */
    title?: VNodeChild | JSX.Element;

    /**
     * Set props on per header row
     * @type Function
     */
    customHeaderRow?: (column: ColumnProps<T>, index: number) => object;

    /**
     * Set props on per row
     * @type Function
     */
    customRow?: (record: T, index: number) => object;

    /**
     * `table-layout` attribute of table element
     * `fixed` when header/columns are fixed, or using `column.ellipsis`
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
     * @version 1.5.0
     */
    tableLayout?: 'auto' | 'fixed' | string;

    /**
     * the render container of dropdowns in table
     * @param triggerNode
     * @version 1.5.0
     */
    getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;

    /**
     * Data can be changed again before rendering.
     * The default configuration of general user empty data.
     * You can configured globally through [ConfigProvider](https://antdv.com/components/config-provider-cn/)
     *
     * @version 1.5.4
     */
    transformCellText?: Function;

    /**
     * Callback executed when pagination, filters or sorter is changed
     * @param pagination
     * @param filters
     * @param sorter
     * @param currentDataSource
     */
    onChange?: (
      pagination: PaginationConfig,
      filters: Partial<Record<keyof T, string[]>>,
      sorter: SorterResult<T>,
      extra: TableCurrentDataSource<T>,
    ) => void;

    /**
     * Callback executed when the row expand icon is clicked
     *
     * @param expanded
     * @param record
     */
    onExpand?: (expande: boolean, record: T) => void;

    /**
     * Callback executed when the expanded rows change
     * @param expandedRows
     */
    onExpandedRowsChange?: (expandedRows: string[] | number[]) => void;
  };
}
