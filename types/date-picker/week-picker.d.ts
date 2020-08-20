// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { DatepickerMethod, DatepickerProps } from './common';
import { Moment } from 'moment';
import { VNodeChild } from 'vue';

declare class WeekPickerProps extends DatepickerProps {
  /**
   * to set default date
   * @type Moment
   */
  defaultValue?: Moment | string;

  /**
   * to set default picker date
   * @type Moment
   */
  defaultPickerValue?: Moment | string;

  /**
   * to set the date format, refer to moment.js
   * @default 'YYYY-wos'
   * @type string
   * @see http://momentjs.com
   */
  format?: string;

  /**
   * to set date
   * @type Moment
   */
  value?: Moment | string;

  /**
   * render extra footer in panel by setting a slot
   * v-slot:renderExtraFooter="mode"
   */
  renderExtraFooter?: Function | VNodeChild | JSX.Element;

  /**
   * a callback function, can be executed when the selected time is changing
   */
  onChange?: (date?: Moment | string, dateString?: string) => void;
}

export declare class WeekPicker extends DatepickerMethod {
  $props: WeekPickerProps;
}
