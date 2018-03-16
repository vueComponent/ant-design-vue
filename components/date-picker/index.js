import VcCalendar from '../vc-calendar'
import MonthCalendar from '../vc-calendar/src/MonthCalendar'
import createPicker from './createPicker'
import wrapPicker from './wrapPicker'
import RangePicker from './RangePicker'
import WeekPicker from './WeekPicker'
import { DatePickerProps, MonthPickerProps, WeexPickerProps, RangePickerProps } from './interface'

const DatePicker = wrapPicker(createPicker(VcCalendar), DatePickerProps())

const MonthPicker = wrapPicker(createPicker(MonthCalendar), MonthPickerProps(), 'YYYY-MM')

Object.assign(DatePicker, {
  RangePicker: wrapPicker(RangePicker, RangePickerProps()),
  MonthPicker,
  WeekPicker: wrapPicker(WeekPicker, WeexPickerProps(), 'YYYY-wo'),
})

export default DatePicker
