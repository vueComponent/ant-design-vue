import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';
import { ADatePicker } from './date-picker';
import { Moment } from 'moment';

/** AWeekPicker Layout Component */
export declare class AWeekPicker extends ADatePicker {
  defaultValue: Moment

  defaultPickerValue: Moment

  format: string

  value: any

  change(date: any, dateString: string): void
}

