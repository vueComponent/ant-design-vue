// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class Divider extends AntdComponent {
  /**
   * whether line is dashed
   * @default false
   * @type boolean
   */
  dashed: boolean;

  /**
   * position of title inside divider
   * @default 'center'
   * @type string
   */
  orientation: 'left' | 'right' | 'center';

  /**
   * direction type of divider
   * @default 'horizontal'
   * @type string
   */
  type: 'horizontal' | 'vertical';
}
