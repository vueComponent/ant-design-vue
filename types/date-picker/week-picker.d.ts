// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { DatepickerCommon } from './common';
import { Moment } from 'moment';

export declare class WeekPicker extends DatepickerCommon {
  /**
   * to set default date
   * @type Moment
   */
  defaultValue: Moment;

  /**
   * to set default picker date
   * @type Moment
   */
  defaultPickerValue: Moment;

  /**
   * to set the date format, refer to moment.js
   * @default 'YYYY-wos'
   * @type string
   * @see http://momentjs.com
   */
  format: string;

  /**
   * to set date
   * @type Moment
   */
  value: Moment;
}
