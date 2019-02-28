// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { MenuItem } from './menu-item';

export declare class SubMenu extends AntdComponent {
  /**
   * unique id of the menu item
   * @type string
   */
  key: string;

  /**
   * whether menu item is disabled or not
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * title of the sub menu
   * @type string | slot
   */
  title: any;
}
