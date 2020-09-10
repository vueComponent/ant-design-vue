// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';
import { Moment } from 'moment';
import { VNodeChild } from 'vue';

export interface RenderHeader {
  value: Moment;
  onChange?: (value: Moment) => void;
  type: string;
  onTypeChange?: (type: string) => void;
}

export declare class Calendar extends AntdComponent {
  $props: AntdProps & {
    /**
     * render custom header in panel
     * @param headerRender
     * @version 1.5.0
     */
    headerRender?: (headerRender: RenderHeader) => VNodeChild | JSX.Element;
    /**
     * Customize the display of the date cell by setting a scoped slot,
     * the returned content will be appended to the cell
     * @type Function
     */
    dateCellRender?: (date: Moment) => VNodeChild | JSX.Element;

    /**
     * Customize the display of the date cell by setting a scoped slot,
     * the returned content will override the cell
     * @type Function
     */
    dateFullCellRender?: (date: Moment) => VNodeChild | JSX.Element;

    /**
     * The date selected by default
     * @default default date
     * @type Moment
     */
    defaultValue?: Moment | string;

    /**
     * Function that specifies the dates that cannot be selected
     * @type Function
     */
    disabledDate?: (currentDate: Moment) => boolean;

    /**
     * Whether to display in full-screen
     * @default true
     * @type boolean
     */
    fullscreen?: boolean;

    /**
     * The calendar's locale
     * @default [default]
     * @type object
     * @see https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json
     */
    locale?: object;

    /**
     * The display mode of the calendar
     * @default 'month'
     * @type string
     */
    mode?: 'month' | 'year';

    /**
     * Customize the display of the month cell by setting a scoped slot, the returned content will be appended to the cell
     * @type Function
     */
    monthCellRender?: (date: Moment) => VNodeChild | JSX.Element;

    /**
     * Customize the display of the month cell by setting a scoped slot, the returned content will override the cell
     * @type Function
     */
    monthFullCellRender?: (date: Moment) => VNodeChild | JSX.Element;

    /**
     * to set valid range
     * @type [Moment, Moment]
     */
    validRange?: [Moment, Moment];

    /**
     * The current selected date
     * @default current date
     * @type Moment
     */
    value?: Moment | string;
    /**
     * optional, format of binding value. If not specified,
     * the binding value will be a Date object
     * @version 1.5.4
     */
    valueFormat?: string;

    /**
     * Callback for when panel changes
     * @param date
     * @param mode
     */
    onPanelChange?: (date?: Moment | string, mode?: string) => void;

    /**
     * 	Callback for when a date is selected
     * @param date
     */
    onSelect?: (date?: Moment | string) => void;

    /**
     * Callback for when value change
     * @param date
     */
    onChange?: (date?: Moment | string) => void;
  };
}
