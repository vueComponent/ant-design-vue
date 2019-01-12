// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { DatepickerCommon } from './common';
import { Moment } from 'moment';

export declare class RangePicker extends DatepickerCommon {
  /**
   * to set default date
   * @type [Moment, Moment]
   */
  defaultValue: [Moment, Moment];

  /**
   * to set default picker date
   * @type [Moment, Moment]
   */
  defaultPickerValue: [Moment, Moment];

  /**
   * to specify the time that cannot be selected
   * @type Function
   */
  disabledTime: (dates: [Moment, Moment], partial: 'start' | 'end') => any;

  /**
   * to set the date format, refer to moment.js
   * @default 'YYYY-MM-DD HH:mm:ss'
   * @type string
   * @see http://momentjs.com
   */
  format: string;

  /**
   * preseted ranges for quick selection
   * @type object
   */
  ranges: { [range: string]: Moment[] } | { [range: string]: () => Moment[] };

  /**
   * render extra footer in panel by setting a scoped slot
   * @type any (slot="renderExtraFooter")
   */
  renderExtraFooter: any;

  /**
   * to provide an additional time selection
   * showTime.defaultValue to set default time of selected date - type Moment[]
   * @default TimePicker Options
   * @type object | boolean
   */
  showTime: object | boolean;

  /**
   * to set date
   * @type [Moment, Moment]
   */
  value: [Moment, Moment];
}
