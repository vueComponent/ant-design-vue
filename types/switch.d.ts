// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Switch extends AntdComponent {
  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * determine whether the Switch is checked
   * @default false
   * @type boolean
   */
  checked: boolean;

  /**
   * content to be shown when the state is checked
   * @type any (string | slot)
   */
  checkedChildren: any;

  /**
   * to set the initial state
   * @default false
   * @type boolean
   */
  defaultChecked: boolean;

  /**
   * Disable switch
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * loading state of switch
   * @default false
   * @type boolean
   */
  loading: boolean;

  /**
   * the size of the Switch, options: default small
   * @default 'default'
   * @type string
   */
  size: 'small' | 'default' | 'large';

  /**
   * content to be shown when the state is unchecked
   * @type any (string | slot)
   */
  unCheckedChildren: any;

  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}
