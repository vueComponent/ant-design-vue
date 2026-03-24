import type { Dayjs } from 'dayjs'

export type PanelMode = 'date' | 'week' | 'month' | 'quarter' | 'year' | 'decade' | 'time'
export type PickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year'

export interface DisabledTimes {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

export interface TimeProps {
  format?: string
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  hideDisabledOptions?: boolean
  defaultValue?: Dayjs | [Dayjs, Dayjs]
  disabledTime?: (date: Dayjs | null) => DisabledTimes
}

export interface PresetDate<T = Dayjs> {
  label: string
  value: T | (() => T)
}

export interface PanelSharedProps {
  viewDate: Dayjs
  value?: Dayjs | null
  disabledDate?: (date: Dayjs) => boolean
  locale?: DateLocale
}

export interface DateLocale {
  locale: string
  dayNames: string[]
  dayNamesShort: string[]
  monthNames: string[]
  monthNamesShort: string[]
  today: string
  now: string
  ok: string
}

export const defaultLocale: DateLocale = {
  locale: 'en',
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ],
  today: 'Today',
  now: 'Now',
  ok: 'OK',
}
