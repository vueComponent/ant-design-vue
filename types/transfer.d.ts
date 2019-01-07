// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export declare class Transfer extends AntdComponent {
  /**
   * Used for setting the source data. The elements that are part of this array will be present the left column.
   * Except the elements whose keys are included in targetKeys prop.
   * @default []
   * @type TransferItem[]
   */
  dataSource: TransferItem[];

  /**
   * Whether disabled transfer
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * A function to determine whether an item should show in search result list
   * @type Function
   */
  filterOption: (inputValue: any, option: any) => boolean;

  /**
   * customize the progress dot by setting a scoped slot
   * @type any (slot="footer" slot-scope="props")
   */
  footer: any;

  /**
   * property of vc-lazy-load for lazy rendering items. Turn off it by set to false.
   * @default { height: 32, offset: 32 }
   * @type object | boolean
   */
  lazy: object | boolean;

  /**
   * A custom CSS style used for rendering the transfer columns.
   * @type object
   */
  listStyle: object;

  /**
   * i18n text including filter, empty text, item unit, etc
   * @default { itemUnit: 'item', itemsUnit: 'items', notFoundContent: 'The list is empty', searchPlaceholder: 'Search here' }
   * @type object
   */
  locale: {
    itemUnit: string;
    itemsUnit: string;
    notFoundContent: string;
    searchPlaceholder: string;
  };

  /**
   * A set of operations that are sorted from top to bottom.
   * @default ['>', '<']
   * @type string[]
   */
  operations: string[];

  /**
   * The function to generate the item shown on a column.
   * Based on an record (element of the dataSource array),
   * this function should return a element which is generated from that record.
   * Also, it can return a plain object with value and label, label is a element and value is for title
   * @type Function
   */
  render: (record: TransferItem) => void;

  /**
   * A set of keys of selected items.
   * @default []
   * @type string[]
   */
  selectedKeys: string[];

  /**
   * If included, a search box is shown on each column.
   * @default false
   * @type boolean
   */
  showSearch: boolean;

  /**
   * A set of keys of elements that are listed on the right column.
   * @default []
   * @type string[]
   */
  targetKeys: string[];

  /**
   * A set of titles that are sorted from left to right.
   * @type string[]
   */
  titles: string[];
}
