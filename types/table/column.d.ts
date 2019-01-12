// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { VNode } from 'vue';
import { ScopedSlot } from 'vue/types/vnode';

export interface ColumnFilterItem {
  text?: string;
  value?: string;
  children?: any;
}

export declare type SortOrder = 'ascend' | 'descend';

export declare class Column extends AntdComponent {
  /**
   * specify how content is aligned
   * @default 'left'
   * @type string
   */
  align: 'left' | 'right' | 'center';

  /**
   * Span of this column's title
   * @type number
   */
  colSpan: number;

  /**
   * Display field of the data record, could be set like a.b.c
   * @type string
   */
  dataIndex: string;

  /**
   * Default order of sorted values: 'ascend' 'descend' null
   * @type string
   */
  defaultSortOrder: SortOrder;

  /**
   * Customized filter overlay
   * @type any (slot)
   */
  filterDropdown: any;

  /**
   * Whether filterDropdown is visible
   * @type boolean
   */
  filterDropdownVisible: boolean;

  /**
   * Whether the dataSource is filtered
   * @default false
   * @type boolean
   */
  filtered: boolean;

  /**
   * Controlled filtered value, filter icon will highlight
   * @type string[]
   */
  filteredValue: string[];

  /**
   * Customized filter icon
   * @default false
   * @type any
   */
  filterIcon: any;

  /**
   * Whether multiple filters can be selected
   * @default true
   * @type boolean
   */
  filterMultiple: boolean;

  /**
   * Filter menu config
   * @type object[]
   */
  filters: ColumnFilterItem[];

  /**
   * Set column to be fixed: true(same as left) 'left' 'right'
   * @default false
   * @type boolean | string
   */
  fixed: boolean | 'left' | 'right';

  /**
   * Unique key of this column, you can ignore this prop if you've set a unique dataIndex
   * @type string
   */
  key: string;

  /**
   * Renderer of the table cell. The return value should be a VNode, or an object for colSpan/rowSpan config
   * @type Function | ScopedSlot
   */
  customRender: Function | ScopedSlot;

  /**
   * Sort function for local sort, see Array.sort's compareFunction. If you need sort buttons only, set to true
   * @type boolean | Function
   */
  sorter: boolean | Function;

  /**
   * Order of sorted values: 'ascend' 'descend' false
   * @type boolean | string
   */
  sortOrder: boolean | SortOrder;

  /**
   * Title of this column
   * @type any (string | slot)
   */
  title: any;

  /**
   * Width of this column
   * @type string | number
   */
  width: string | number;

  /**
   * Set props on per cell
   * @type Function
   */
  customCell: (
    record: any,
    rowIndex: number,
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };

  /**
   * Set props on per header cell
   * @type
   */
  customHeaderCell: (
    column: any,
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };

  /**
   * Callback executed when the confirm filter button is clicked, Use as a filter event when using template or jsx
   * @type Function
   */
  onFilter: Function;

  /**
   * Callback executed when filterDropdownVisible is changed, Use as a filterDropdownVisible event when using template or jsx
   * @type Function
   */
  onFilterDropdownVisibleChange: (visible: boolean) => void;

  /**
   * When using columns, you can use this property to configure the properties that support the slot,
   * such as slots: { filterIcon: 'XXX'}
   * @type object
   */
  slots: object;

  /**
   * When using columns, you can use this property to configure the properties that support the slot-scope,
   * such as scopedSlots: { customRender: 'XXX'}
   * @type object
   */
  scopedSlots: object;
}
