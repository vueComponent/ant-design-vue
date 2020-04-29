// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Moment } from 'moment';

export declare class DatepickerCommon extends AntdComponent {
  /**
   * Whether to show clear button
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
   * custom rendering function for date cells by setting a scoped slot
   * @type any (slot="dateRender" slot-scope="current, today")
   */
  dateRender: any;

  /**
   * determine whether the DatePicker is disabled
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * specify the date that cannot be selected
   * @type Function
   */
  disabledDate: (currentDate: Moment) => boolean;

  /**
   * to set the container of the floating layer, while the default is to create a div element in body
   * @type Function
   */
  getCalendarContainer: (trigger: any) => any;

  /**
   * localization configuration
   * @type any
   */
  locale: any;

  /**
   * open state of picker
   * @type boolean
   */
  open: boolean;

  /**
   * placeholder of date input
   * @type string | string[]
   */
  placeholder: string | string[];

  /**
   * to customize the style of the popup calendar
   * @type object
   */
  popupStyle: object;

  /**
   * to customize the className of the popup calendar
   * @type string
   */
  dropdownClassName: string;

  /**
   * determine the size of the input box, the height of large and small, are 40px and 24px respectively, while default size is 32px
   * @type string
   */
  size: 'large' | 'small' | 'default';

  /**
   * The custom suffix icon
   * @type any (VNode | slot)
   */
  suffixIcon: any;

  inputReadOnly: boolean;
  valueFormat: string;
}
