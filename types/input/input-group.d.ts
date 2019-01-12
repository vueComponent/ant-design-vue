// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class InputGroup extends AntdComponent {
  /**
   * Whether use compact style
   * @default false
   * @type boolean
   */
  compact: boolean;

  /**
   * The size of Input.Group specifies the size of the included Input fields. Available: large default small
   * @default 'default'
   * @type string
   */
  size: 'small' | 'large' | 'default';
}
