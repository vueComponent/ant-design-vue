// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { Moment } from 'moment';

export declare class TimePicker extends AntdComponent {
  /**
   * some addon to timepicker panel bottom
   * @type any (slot | slot-scope)
   */
  addon: any;

  /**
   * allow clearing text
   * @default true
   * @type boolean
   */
  allowClear: boolean;

  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * clear tooltip of icon
   * @default 'clear'
   * @type string
   */
  clearText: string;

  /**
   * default open panel value, used to set utcOffset,locale if value/defaultValue absent
   * @default Moment
   * @type Moment
   */
  defaultOpenValue: Moment;

  /**
   * to set default time
   * @type Moment
   */
  defaultValue: Moment | string;

  /**
   * determine whether the TimePicker is disabled
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * to specify the hours that cannot be selected
   * @type Function
   */
  disabledHours: () => any;

  /**
   * to specify the minutes that cannot be selected
   * @type Function
   */
  disabledMinutes: (selectedHour: any) => any;

  /**
   * to specify the seconds that cannot be selected
   * @type Function
   */
  disabledSeconds: (selectedHour: any, selectedMinute: any) => any;

  /**
   * to set the time format
   * @default "HH:mm:ss"
   * @type string
   */
  format: string;

  /**
   * to set the container of the floating layer, while the default is to create a div element in body
   * @type Function
   */
  getPopupContainer: (trigger: any) => any;

  /**
   * hide the options that can not be selected
   * @default false
   * @type boolean
   */
  hideDisabledOptions: boolean;

  /**
   * interval between hours in picker
   * @default 1
   * @type number
   */
  hourStep: number;

  /**
   * Set the readonly attribute of the input tag (avoids virtual keyboard on touch devices)
   * @default false
   * @type boolean
   */
  inputReadOnly: boolean;

  /**
   * interval between minutes in picker
   * @default 1
   * @type number
   */
  minuteStep: number;

  /**
   * whether to popup panel
   * @default false
   * @type boolean
   */
  open: boolean;

  /**
   * display when there's no value
   * @default "Select a time"
   * @type string
   */
  placeholder: string;

  /**
   * className of panel
   * @type string
   */
  popupClassName: string;

  popupStyle: object;

  /**
   * interval between seconds in picker
   * @default 1
   * @type number
   */
  secondStep: number;

  /**
   * The custom suffix icon
   * @type any (string | VNode | slot)
   */
  suffixIcon: any;

  /**
   * display as 12 hours format, with default format h:mm:ss a
   * @default false
   * @type boolean
   */
  use12Hours: boolean;

  /**
   * to set time
   * @type Moment
   */
  value: Moment | string;

  /**
   * Time picker size
   * @default 'default'
   * @type string
   */
  size: 'large' | 'default' | 'small';

  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}
