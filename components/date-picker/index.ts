import VcCalendar from '../vc-calendar';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import createPicker from './createPicker';
import wrapPicker from './wrapPicker';
import RangePicker from './RangePicker';
import WeekPicker from './WeekPicker';
import { DatePickerProps, MonthPickerProps, WeekPickerProps, RangePickerProps } from './interface';
import { App, DefineComponent, defineComponent } from 'vue';
type DatePickerPropstypes = typeof DatePickerProps;

const DatePicker: DefineComponent<DatePickerPropstypes> = defineComponent<DatePickerPropstypes>(
  wrapPicker(
    {
      ...createPicker(VcCalendar as any, DatePickerProps),
      name: 'ADatePicker',
    } as any,
    DatePickerProps,
    'date',
  ) as any,
);

const MonthPicker = wrapPicker(
  { ...createPicker(MonthCalendar as any, MonthPickerProps), name: 'AMonthPicker' } as any,
  MonthPickerProps,
  'month',
);

Object.assign(DatePicker, {
  RangePicker: wrapPicker(RangePicker as any, RangePickerProps, 'date'),
  MonthPicker,
  WeekPicker: wrapPicker(WeekPicker as any, WeekPickerProps, 'week'),
});

/* istanbul ignore next */
DatePicker.install = function(app: App) {
  app.component(DatePicker.name, DatePicker);
  app.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
  app.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
  app.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker);
  return app;
};

export default DatePicker;
