// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { VNodeChild } from 'vue';
import { Pagination } from '../pagination';
import { ListItem } from './list-item';

export declare type ColumnCount = '' | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;

export declare class PaginationConfig extends Pagination {
  position?: 'top' | 'bottom' | 'both';
}

export interface Item {
  item?: any;
  index?: number;
}

export class List extends AntdComponent {
  static Item: typeof ListItem;

  $props: AntdProps & {
    /**
     * Toggles rendering of the border around the list
     * @default false
     * @type boolean
     */
    bordered?: boolean;

    /**
     * List footer renderer
     * @type any (string | slot)
     */
    footer?: VNodeChild | JSX.Element;

    /**
     * The grid type of list. You can set grid to something like {gutter: 16, column: 4}
     * @type object
     */
    grid?: {
      gutter?: number;
      column?: ColumnCount;
      xs?: ColumnCount;
      sm?: ColumnCount;
      md?: ColumnCount;
      lg?: ColumnCount;
      xl?: ColumnCount;
      xxl?: ColumnCount;
    };

    /**
     * List header renderer
     * @type any (string | slot)
     */
    header?: VNodeChild | JSX.Element;

    /**
     * The layout of list, default is horizontal,
     * If a vertical list is desired, set the itemLayout property to vertical
     *
     * @type string
     */
    itemLayout?: string | 'horizontal' | 'vertical';

    /**
     * Shows a loading indicator while the contents of the list are being fetched
     * @default false
     * @type boolean | object
     */
    loading?: boolean | object;

    /**
     * Shows a load more content
     * @type any (string | slot)
     */
    loadMore?: VNodeChild | JSX.Element;

    /**
     * i18n text including empty text
     * @default emptyText: 'No Data'
     * @type object
     */
    locale?: object;

    /**
     * Pagination config, hide it by setting it to false
     * @default false
     * @type boolean | object
     */
    pagination?: boolean | PaginationConfig;

    /**
     * Toggles rendering of the split under the list item
     * @default true
     * @type boolean
     */
    split?: boolean;

    /**
     * dataSource array for list
     */
    dataSource?: any[];

    /**
     * Custom item renderer, slot="renderItem" and slot-scope="{ item, index }"
     * @default null
     * @type Function()
     */
    renderItem?: (item?: Item) => VNodeChild | JSX.Element;

    /**
     * Specify the key that will be used for uniquely identify each element
     * @default null
     * @type Function
     */
    rowKey?: (item: any) => string | number;
  };
}
