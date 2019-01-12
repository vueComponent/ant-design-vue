// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class LayoutSider extends AntdComponent {
  /**
   * container className
   * @type string
   */
  class: string;

  /**
   * whether can be collapsed
   * @default false
   * @type boolean
   */
  collapsible: boolean;

  /**
   * to set the current status
   * @type boolean
   */
  collapsed: boolean;

  /**
   * to set the initial status
   * @default false
   * @type boolean
   */
  defaultCollapsed: boolean;

  /**
   * reverse direction of arrow, for a sider that expands from the right
   * @default false
   * @type boolean
   */
  reverseArrow: boolean;

  /**
   * to customize the styles
   * @type object | string
   */
  style: object | string;

  /**
   * specify the customized trigger, set to null to hide the trigger
   * @type string | slot
   */
  trigger: any;

  /**
   * width of the sidebar
   * @default 200
   * @type number | string
   */
  width: number | string;

  /**
   * width of the collapsed sidebar, by setting to 0 a special trigger will appear
   * @default 80
   * @type number
   */
  collapsedWidth: number;

  /**
   * breakpoints of the responsive layout
   * @type string
   */
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * color theme of the sidebar
   * @default 'dark'
   * @type string
   */
  theme: 'light' | 'dark';
}
