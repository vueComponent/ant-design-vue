// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { MenuItem } from './menu-item';

export declare class MenuItemGroup extends AntdComponent {
  /**
   * sub menu items
   * @type MenuItem[]
   */
  children: MenuItem[];

  /**
   * title of the group
   * @type string | slot
   */
  title: any;
}
