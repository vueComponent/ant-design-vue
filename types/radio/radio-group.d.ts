// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';

export declare class RadioGroup extends AntdComponent {
  /**
   * Specifies the initial state: whether or not the radio is selected.
   * @type boolean
   */
  defaultValue: boolean;

  /**
   * Disable radio
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * The name property of all input[type="radio"] children
   * @type string
   */
  name: string;

  /**
   * set children optional
   * @type Array<string | { label: string, value: string, disabled?: boolean }>
   */
  options: Array<string | { label: string; value: string; disabled?: boolean }>;

  /**
   * size for radio button style
   * @default 'default'
   * @type String
   */
  size: 'large' | 'default' | 'small';

  /**
   * Used for setting the currently selected value.
   * @type any
   */
  value: any;

  /**
   * style type of radio button
   * @default 'outline'
   * @type string
   */
  buttonStyle: 'outline' | 'solid';
}
