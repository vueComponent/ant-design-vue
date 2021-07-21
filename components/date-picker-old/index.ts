import type { App, DefineComponent, Plugin } from 'vue';
import VcCalendar from '../vc-calendar';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import createPicker from './createPicker';
import wrapPicker from './wrapPicker';
import RangePicker from './RangePicker';
import WeekPicker from './WeekPicker';
import { DatePickerProps, MonthPickerProps, WeekPickerProps, RangePickerProps } from './props';
import type {
  DatePickerPropsTypes,
  RangePickerPropsTypes,
  MonthPickerPropsTypes,
  WeekPickerPropsTypes,
} from './interface';

const WrappedRangePicker = wrapPicker(
  RangePicker as any,
  RangePickerProps,
  'date',
) as unknown as DefineComponent<RangePickerPropsTypes>;

const WrappedWeekPicker = wrapPicker(
  WeekPicker as any,
  WeekPickerProps,
  'week',
) as unknown as DefineComponent<WeekPickerPropsTypes>;

const DatePicker = wrapPicker(
  createPicker(VcCalendar as any, DatePickerProps, 'ADatePicker'),
  DatePickerProps,
  'date',
) as unknown as DefineComponent<DatePickerPropsTypes> & {
  readonly RangePicker: typeof WrappedRangePicker;
  readonly MonthPicker: typeof MonthPicker;
  readonly WeekPicker: typeof WrappedWeekPicker;
};

export const MonthPicker = wrapPicker(
  createPicker(MonthCalendar as any, MonthPickerProps, 'AMonthPicker'),
  MonthPickerProps,
  'month',
) as unknown as DefineComponent<MonthPickerPropsTypes>;

Object.assign(DatePicker, {
  RangePicker: WrappedRangePicker,
  MonthPicker,
  WeekPicker: WrappedWeekPicker,
});

/* istanbul ignore next */
DatePicker.install = function (app: App) {
  app.component(DatePicker.name, DatePicker);
  app.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
  app.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
  app.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker);
  return app;
};

export { WrappedRangePicker as RangePicker, WrappedWeekPicker as WeekPicker };

export default DatePicker as typeof DatePicker & Plugin;
