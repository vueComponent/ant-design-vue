// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { ButtonGroup } from './button-group';

export declare class Button extends AntdComponent {
  static Group: typeof ButtonGroup;

  /**
   * can be set to primary ghost dashed danger(added in 2.7) or omitted (meaning default)
   * @default 'default'
   * @type string
   */
  type: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';

  /**
   * set the original html type of button
   * @default 'button'
   * @type string
   */
  htmlType: 'button' | 'submit' | 'reset' | 'menu';

  /**
   * set the icon of button
   * @type string
   */
  icon: string;

  /**
   * can be set to circle or circle-outline or omitted
   * @type string
   */
  shape: 'circle' | 'circle-outline';

  /**
   * can be set to small large or omitted
   * @default 'default'
   * @type string
   */
  size: 'small' | 'large' | 'default';

  /**
   * set the loading status of button
   * @default false
   * @type boolean | { delay: number }
   */
  loading: boolean | { delay: number };

  /**
   * disabled state of button
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * make background transparent and invert text and border colors, added in 2.7
   * @default false
   * @type boolean
   */
  ghost: boolean;

  /**
   * option to fit button width to its parent width
   * @default false
   * @type boolean
   */
  block: boolean;
}
