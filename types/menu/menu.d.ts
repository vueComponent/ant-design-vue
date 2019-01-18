// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { MenuItem } from './menu-item';
import { SubMenu } from './sub-menu';
import { MenuItemGroup } from './menu-item-group';
import { Divider } from '../divider';

export declare class Menu extends AntdComponent {
  static Item: typeof MenuItem;
  static SubMenu: typeof SubMenu;
  static ItemGroup: typeof MenuItemGroup;
  static Divider: typeof Divider;

  /**
   * Allow selection of multiple items
   * @default false
   * @type boolean
   */
  multiple: boolean;

  /**
   * array with the keys of currently selected menu items
   * @type string[]
   */
  selectedKeys: string[];

  /**
   * array with the keys of default selected menu items
   * @type string[]
   */
  defaultSelectedKeys: string[];

  /**
   * array with the keys of default opened sub menus
   * @type any
   */
  defaultOpenKeys: any;

  /**
   * array with the keys of currently opened sub menus
   * @type string[]
   */
  openKeys: string[];

  /**
   * type of the menu; vertical, horizontal, and inline modes are supported
   * @default 'vertical'
   * @type string
   */
  mode: 'horizontal' | 'vertical' | 'vertical-left' | 'vertical-right' | 'inline';

  /**
   * delay time to show submenu when mouse enter, unit: second
   * @default 0
   * @type number
   */
  subMenuOpenDelay: number;

  /**
   * delay time to hide submenu when mouse leave, unit: second
   * @default 0.1
   * @type number
   */
  subMenuCloseDelay: Number;

  /**
   * indent px of inline menu item on each level
   * @default 24
   * @type number
   */
  inlineIndent: number;

  /**
   * style of the root node
   * @type object
   */
  style: object;

  /**
   * color theme of the menu
   * @default 'light'
   * @type string
   */
  theme: 'light' | 'dark';

  /**
   * render submenu into DOM before it shows
   * @default false
   * @type boolean
   */
  forceSubMenuRender: boolean;

  /**
   * allow selecting menu items
   * @default true
   * @type boolean
   */
  selectable: boolean;

  /**
   * specifies the collapsed status when menu is inline mode
   * @type boolean
   */
  inlineCollapsed: boolean;
}
