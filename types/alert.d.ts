// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Alert extends AntdComponent {
  /**
   * Called when close animation is finished
   * @type Function
   */
  afterClose: () => void;

  /**
   * Whether to show as banner
   * @default false
   * @type boolean
   */
  banner: boolean;

  /**
   * Whether Alert can be closed
   * @type boolean
   */
  closable: boolean;

  /**
   * Close text to show
   * @type any (string | slot)
   */
  closeText: any;

  /**
   * additional content of Alert
   * @type any (string | slot)
   */
  description: any;

  /**
   * Custom icon, effective when showIcon is true
   * @type any (VNode | slot)
   */
  icon: any;

  /**
   * Content of Alert
   * @type any (string | slot)
   */
  message: any;

  /**
   * Whether to show icon
   * @default false, in banner mode default is true
   * @type boolean
   */
  showIcon: boolean;

  /**
   * Type of Alert styles, options: success, info, warning, error
   * @default info, in banner mode default is warning
   * @type string
   */
  type: 'success' | 'info' | 'warning' | 'error';
}
