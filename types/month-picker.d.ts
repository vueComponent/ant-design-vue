import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';
import { ADatePicker } from './date-picker';
import { Moment } from 'moment';


/** AMonthPicker Layout Component */
export declare class AMonthPicker extends ADatePicker {
  defaultValue: Moment

  defaultPickerValue: Moment

  format: string

  monthCellContentRender: VNode

  renderExtraFooter: VNode

  value: Moment

  change(date: any, dateString: string): void
}

