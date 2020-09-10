// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';
import { VNodeChild, CSSProperties } from 'vue';

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export declare type Direction = 'left' | 'right';

export declare class Transfer extends AntdComponent {
  $props: AntdProps & {
    /**
     * Used for setting the source data. The elements that are part of this array will be present the left column.
     * Except the elements whose keys are included in targetKeys prop.
     * @default []
     * @type TransferItem[]
     */
    dataSource?: TransferItem[];

    /**
     * Whether disabled transfer
     * @default false
     * @type boolean
     */
    disabled?: boolean;

    /**
     * A function to determine whether an item should show in search result list
     * @type Function
     */
    filterOption?: (inputValue?: any, option?: any) => boolean;

    /**
     * customize the progress dot by setting a scoped slot
     * @type any (slot="footer" slot-scope="props")
     */
    footer?: VNodeChild | JSX.Element;

    /**
     * property of vc-lazy-load for lazy rendering items. Turn off it by set to false.
     * @default { height: 32, offset: 32 }
     * @type object | boolean
     */
    lazy?: object | boolean;

    /**
     * A custom CSS style used for rendering the transfer columns.
     * @type object
     */
    listStyle?: CSSProperties;

    /**
     * i18n text including filter, empty text, item unit, etc
     * @default { itemUnit: 'item', itemsUnit: 'items', notFoundContent: 'The list is empty', searchPlaceholder: 'Search here' }
     * @type object
     */
    locale?: {
      itemUnit?: string;
      itemsUnit?: string;
      notFoundContent?: string;
      searchPlaceholder?: string;
    };

    /**
     * A set of operations that are sorted from top to bottom.
     * @default ['>', '<']
     * @type string[]
     */
    operations?: string[];

    /**
     * The function to generate the item shown on a column.
     * Based on an record (element of the dataSource array),
     * this function should return a element which is generated from that record.
     * Also, it can return a plain object with value and label, label is a element and value is for title
     * @type Function
     */
    render?: (record: TransferItem) => void;

    /**
     * A set of keys of selected items.
     * @default []
     * @type string[]
     */
    selectedKeys?: string[];

    /**
     * If included, a search box is shown on each column.
     * @default false
     * @type boolean
     */
    showSearch?: boolean;

    /**
     * Show select all checkbox on the header
     *
     * @version 1.5.0
     */
    showSelectAll?: boolean;

    /**
     * A set of keys of elements that are listed on the right column.
     * @default []
     * @type string[]
     */
    targetKeys?: string[];

    /**
     * A set of titles that are sorted from left to right.
     * @type string[]
     */
    titles?: string[];

    /**
     * A callback function that is executed when the transfer between columns is complete.
     *
     * @param targetKeys
     * @param direction
     * @param moveKeys
     */
    onChange?: (targetKeys: any[], direction: Direction, moveKeys: any[]) => void;

    /**
     * A callback function which is executed when scroll options list
     *
     * @param direction
     * @param e
     */
    onScroll?: (direction: Direction, e: Event) => void;

    /**
     * A callback function which is executed when search field are changed
     * @param direction
     * @param value
     */
    onSearch?: (direction: Direction, value: string) => void;

    /**
     * A callback function which is executed when selected items are changed.
     * @param sourceSelectedKeys
     * @param targetSelectedKeys
     */
    onSelectChange?: (sourceSelectedKeys: any[], targetSelectedKeys: any[]) => void;
  };
}
