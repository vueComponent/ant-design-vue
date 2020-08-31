// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { Moment } from 'moment';
import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from '../component';

export declare class DatepickerProps {
  /**
   * Whether to show clear button
   * @default true
   * @type boolean
   */
  allowClear?: boolean;

  /**
   * get focus when component mounted
   * @default false
   * @type boolean
   */
  autofocus?: boolean;

  /**
   * custom rendering function for date cells by setting a scoped slot
   * @type VNodeChild | JSX.Element (slot="dateRender" slot-scope="current, today")
   */
  dateRender?: VNodeChild | JSX.Element;

  /**
   * determine whether the DatePicker is disabled
   * @default false
   * @type boolean
   */
  disabled?: boolean;

  /**
   * specify the date that cannot be selected
   * @type Function
   */
  disabledDate?: (currentDate?: Moment) => boolean;

  /**
   * to set the container of the floating layer, while the default is to create a div element in body
   * @type Function
   */
  getCalendarContainer?: (trigger?: any) => HTMLElement;

  /**
   * localization configuration
   * @type any
   */
  locale?: object;

  /**
   * picker panel mode *(Cannot select year or month anymore?
   * @see https://antdv.com/docs/vue/faq#When-set-mode-to-DatePicker/RangePicker,-cannot-select-year-or-month-anymore?
   */
  mode?: 'time' | 'date' | 'month' | 'year' | 'decade';

  /**
   * open state of picker
   * @type boolean
   */
  open?: boolean;

  /**
   * placeholder of date input
   * @type string | string[]
   */
  placeholder?: string | string[];

  /**
   * to customize the style of the popup calendar
   * @type object
   */
  popupStyle?: object;

  /**
   * to customize the className of the popup calendar
   * @type string
   */
  dropdownClassName?: string;

  /**
   * determine the size of the input box, the height of large and small, are 40px and 24px respectively, while default size is 32px
   * @type string
   */
  size?: 'large' | 'small' | 'default';

  /**
   * The custom suffix icon
   * @type any (VNode | slot)
   */
  suffixIcon?: VNodeChild | JSX.Element;

  /**
   * Set the readonly attribute of the input tag (avoids virtual keyboard on touch devices)
   * @version 1.5.4
   */
  inputReadOnly?: boolean;

  /**
   * this value will be merged into placement's config, please refer to the settings
   * @see https://github.com/yiminghe/dom-align
   * @version 1.5.4
   */
  align?: object;

  /**
   * optional, format of binding value. If not specified, the binding value will be a Date object
   * @version 1.5.4
   */
  valueFormat?: string;

  /**
   * a callback function, can be executed whether the popup calendar is popped up or closed
   */
  onOpenChange?: (status?: any) => void;

  /**
   * callback when picker panel mode is changed
   */
  onPanelChange?: (value?: any, mode?: any) => void;
}

export declare class DatepickerMethod extends AntdComponent {
  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}
