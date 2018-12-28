import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';
import { ADatePicker } from './date-picker';
import { Moment } from 'moment';

/** ARangePicker Layout Component */
export declare class ARangePicker extends ADatePicker {

  defaultValue: Moment

  defaultPickerValue: Moment

  format: string

  ranges: () => { [range: string]: Moment[] } | { [range: string]: () => Moment[] }

  renderExtraFooter: VNode

  value: any

  calendarChange(dates: object[], dateStrings: [string, string]): void

  change(date: any, dateString: string): void

  ok(): void
}

