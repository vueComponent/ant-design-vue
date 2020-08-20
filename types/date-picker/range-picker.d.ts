// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { DatepickerMethod, DatepickerProps } from './common';
import { Moment } from 'moment';
import { VNodeChild } from 'vue';

declare class RangePickerProps extends DatepickerProps {
  /**
   * to set default date
   * @type [Moment, Moment]
   */
  defaultValue?: [Moment, Moment] | [string, string];

  /**
   * to set default picker date
   * @type [Moment, Moment]
   */
  defaultPickerValue?: [Moment, Moment] | [string, string];

  /**
   * to specify the time that cannot be selected
   * @type Function
   */
  disabledTime?: (dates: [Moment, Moment], partial: 'start' | 'end') => any;

  /**
   * to set the date format, refer to moment.js
   * @default 'YYYY-MM-DD HH:mm:ss'
   * @type string
   * @see http://momentjs.com
   */
  format?: string;

  /**
   * preseted ranges for quick selection
   * @type object
   */
  ranges?: { [range: string]: Moment[] } | { [range: string]: () => Moment[] };

  /**
   * render extra footer in panel by setting a scoped slot
   * @type any (slot="renderExtraFooter")
   */
  renderExtraFooter?: Function | VNodeChild | JSX.Element;

  /**
   * set separator between inputs
   * @default '~'
   * @version 1.5.0
   */
  separator?: string;

  /**
   * to provide an additional time selection
   * showTime.defaultValue to set default time of selected date - type Moment[]
   * @default TimePicker Options
   * @type object | boolean
   */
  showTime?: object | boolean;

  /**
   * to set date
   * @type [Moment, Moment]
   */
  value?: [Moment, Moment] | [string, string];

  /**
   * a callback function, can be executed when the start time or the end time of the range is changing
   */
  onCalendarChange?: (
    dates?: [Moment, Moment] | [string, string],
    dateStrings?: [string, string],
  ) => void;

  /**
   * a callback function, can be executed when the selected time is changing
   */
  onChange?: (dates?: [Moment, Moment] | [string, string], dateStrings?: [string, string]) => void;

  /**
   * callback when click ok button
   */
  onOk?: (dates?: [Moment, Moment] | [string, string]) => void;
}

export declare class RangePicker extends DatepickerMethod {
  $props: RangePickerProps;
}
