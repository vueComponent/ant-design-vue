import { AntdVueComponent, AntdVueComponentSize } from './component';
import { VNode } from 'vue';
import { Moment } from 'moment';

/** ACalendar Layout Component */
export declare class ACalendar extends AntdVueComponent {
  dateCellRender: (date: Moment) => void

  dateFullCellRender: (date: Moment) => void

  defaultValue: Moment

  disabledDate: (currentDate: Moment) => boolean

  fullscreen: boolean

  locale: object

  mode: string

  monthCellRender: (date: Moment) => void

  monthFullCellRender: (date: Moment) => void

  validRange: [Moment, Moment]

  value: Moment
}
