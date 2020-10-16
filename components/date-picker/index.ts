import VcCalendar from '../vc-calendar';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import createPicker from './createPicker';
import wrapPicker from './wrapPicker';
import RangePicker from './RangePicker';
import WeekPicker from './WeekPicker';
import { DatePickerProps, MonthPickerProps, WeekPickerProps, RangePickerProps } from './props';
import { App, defineComponent } from 'vue';
import {
  DatePickerDecorator,
  DatePickerPropsTypes,
  RangePickerPropsTypes,
  MonthPickerPropsTypes,
  WeekPickerPropsTypes,
} from './interface';

const DatePicker = defineComponent<DatePickerPropsTypes>(
  wrapPicker(
    {
      ...createPicker(VcCalendar as any, DatePickerProps),
      name: 'ADatePicker',
    } as any,
    DatePickerProps,
    'date',
  ),
);

const MonthPicker = defineComponent<MonthPickerPropsTypes>(
  wrapPicker(
    { ...createPicker(MonthCalendar as any, MonthPickerProps), name: 'AMonthPicker' } as any,
    MonthPickerProps,
    'month',
  ),
);

Object.assign(DatePicker, {
  RangePicker: defineComponent<RangePickerPropsTypes>(
    wrapPicker(RangePicker as any, RangePickerProps, 'date'),
  ),
  MonthPicker,
  WeekPicker: defineComponent<WeekPickerPropsTypes>(
    wrapPicker(WeekPicker as any, WeekPickerProps, 'week'),
  ),
});

/* istanbul ignore next */
DatePicker.install = function(app: App) {
  app.component(DatePicker.name, DatePicker);
  app.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
  app.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
  app.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker);
  return app;
};

export default DatePicker as DatePickerDecorator;
