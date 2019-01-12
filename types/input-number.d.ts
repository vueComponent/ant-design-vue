// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class InputNumber extends AntdComponent {
  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * initial value
   * @type number | string
   */
  defaultValue: number | string;

  /**
   * disable the input
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * Specifies the format of the value presented
   * @type Function
   */
  formatter: (value: number | string) => string;

  /**
   * max value
   * @default Infinity
   * @type number
   */
  max: number;

  /**
   * mix value
   * @default Infinity
   * @type number
   */
  min: number;

  /**
   * Specifies the value extracted from formatter
   * @type Function
   */
  parser: (string: string) => number;

  /**
   * precision of input value
   * @type number
   */
  precision: number;

  /**
   * decimal separator
   * @type string
   */
  decimalSeparator: string;

  /**
   * width of input box
   * @default 'default'
   * @type string
   */
  size: 'large' | 'small' | 'default';

  /**
   * The number to which the current value is increased or decreased. It can be an integer or decimal.
   * @default 1
   * @type number | string
   */
  step: number | string;

  /**
   * current value
   * @type number | string
   */
  value: number | string;
}
