import VcCalendar from '../vc-calendar';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import createPicker from './createPicker';
import wrapPicker from './wrapPicker';
import RangePicker from './RangePicker';
import WeekPicker from './WeekPicker';
import { DatePickerProps, MonthPickerProps, WeekPickerProps, RangePickerProps } from './interface';

const DatePicker = wrapPicker(
  { ...createPicker(VcCalendar, DatePickerProps()), name: 'ADatePicker' },
  DatePickerProps(),
  'date',
);

const MonthPicker = wrapPicker(
  { ...createPicker(MonthCalendar, MonthPickerProps()), name: 'AMonthPicker' },
  MonthPickerProps(),
  'month',
);

Object.assign(DatePicker, {
  RangePicker: wrapPicker(RangePicker, RangePickerProps(), 'date'),
  MonthPicker,
  WeekPicker: wrapPicker(WeekPicker, WeekPickerProps(), 'week'),
});

/* istanbul ignore next */
DatePicker.install = function(app) {
  app.component(DatePicker.name, DatePicker);
  app.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
  app.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
  app.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker);
};

export default DatePicker;
