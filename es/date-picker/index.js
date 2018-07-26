import _extends from 'babel-runtime/helpers/extends';
import VcCalendar from '../vc-calendar';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import createPicker from './createPicker';
import wrapPicker from './wrapPicker';
import RangePicker from './RangePicker';
import WeekPicker from './WeekPicker';
import { DatePickerProps, MonthPickerProps, WeekPickerProps, RangePickerProps } from './interface';

var DatePicker = wrapPicker(_extends({}, createPicker(VcCalendar, DatePickerProps()), { name: 'ADatePicker' }), DatePickerProps());

var MonthPicker = wrapPicker(_extends({}, createPicker(MonthCalendar, MonthPickerProps()), { name: 'AMonthPicker' }), MonthPickerProps(), 'YYYY-MM');

_extends(DatePicker, {
  RangePicker: wrapPicker(RangePicker, RangePickerProps()),
  MonthPicker: MonthPicker,
  WeekPicker: wrapPicker(WeekPicker, WeekPickerProps(), 'gggg-wo')
});

export default DatePicker;