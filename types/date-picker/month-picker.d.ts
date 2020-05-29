// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { DatepickerCommon } from './common';
import { Moment } from 'moment';

export declare class MonthPicker extends DatepickerCommon {
  /**
   * to set default date
   * @type Moment
   */
  defaultValue: Moment | string;

  /**
   * to set default picker date
   * @type Moment
   */
  defaultPickerValue: Moment | string;

  /**
   * to set the date format, When an array is provided, all values are used for parsing and first value for display. refer to moment.js
   * @default 'YYYY-MM'
   * @type string | string[]
   * @see http://momentjs.com
   */
  format: string | string[];

  /**
   * Custom month cell content render method by setting a scoped slot
   * @type Function (slot="monthCellContentRender", slot-scope="date, locale")
   */
  monthCellContentRender: Function;

  /**
   * render extra footer in panel by setting a scoped slot
   * @type any (slot="renderExtraFooter")
   */
  renderExtraFooter: any;

  /**
   * to set date
   * @type Moment
   */
  value: Moment | string;
}
