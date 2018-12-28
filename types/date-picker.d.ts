import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';
import { Moment } from 'moment';

/** ADatePublic Layout Component */
export declare class ADatePublic extends AntdVueComponent {
  allowClear: boolean

  autoFocus: boolean

  dateRender: VNode

  disabled: boolean

  disabledDate: (currentDate: Moment) => boolean

  getCalendarContainer: (trigger: Event) => void

  locale: object

  open: boolean

  placeholder: string | string[]

  popupStyle: object

  dropdownClassName: string

  size: AntdVueComponentSize

  suffixIcon: VNode

  blur(): void

  focus(): void

  openChange(status: any): void
}


/** ADatePicker Layout Component */
export declare class ADatePicker extends AntdVueComponent {
  defaultValue: Moment

  defaultPickerValue: Moment

  disabledTime(date: Moment | [Moment, Moment], partial?: 'start' | 'end'): void

  format: string

  renderExtraFooter: VNode

  showTime: { defaultValue: Moment } | boolean

  showToday: boolean

  value: any

  change(date: any, dateString: string): void

  ok(): void
}

