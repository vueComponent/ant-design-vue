import VcCalendar from '../vc-calendar'
import MonthCalendar from '../vc-calendar/src/MonthCalendar'
import createPicker from './createPicker'
import wrapPicker from './wrapPicker'
import RangePicker from './RangePicker'
import WeekPicker from './WeekPicker'

const DatePicker = wrapPicker(createPicker(VcCalendar))

const MonthPicker = wrapPicker(createPicker(MonthCalendar), 'YYYY-MM')

Object.assign(DatePicker, {
  RangePicker: wrapPicker(RangePicker),
  MonthPicker,
  WeekPicker: wrapPicker(WeekPicker, 'YYYY-wo'),
})

export default DatePicker
