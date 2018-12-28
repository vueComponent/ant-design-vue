import { VNode } from 'vue';
import { AntdVueComponent } from './component';

/** ATimePicker Layout Component */
export declare class ATimePicker extends AntdVueComponent {
  addon: VNode

  allowEmpty: boolean

  autoFocus: boolean

  clearText: string

  defaultOpenValue: object

  defaultValue: object

  disabled: boolean

  disabledHours(): object

  disabledMinutes(selectedHour: any): object

  disabledSeconds(selectedHour: any, selectedMinute: any): any

  format: string

  getPopupContainer(trigger: VNode): void

  hideDisabledOptions: boolean

  hourStep: number

  inputReadOnly: boolean

  minuteStep: number

  open: boolean

  placeholder: string

  popupClassName: string

  secondStep: number

  use12Hours: boolean

  value: object

  change(time: object, timeString: string): void

  openChange(open: boolean): void

  blur(): void

  focus(): void
}
