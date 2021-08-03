import type { App } from 'vue';
import dataFnsGenerateConfig from '../vc-picker/generate/dataFns';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';
import { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';

export type DatePickerProps = PickerProps<Date> & ExtraDatePickerProps<Date>;
export type MonthPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type WeekPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type RangePickerProps = BaseRangePickerProps<Date> & ExtraRangePickerProps<Date>;

const DatePicker = generatePicker<Date>(dataFnsGenerateConfig);

const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;
const WeekPicker = DatePicker.WeekPicker;
const QuarterPicker = DatePicker.QuarterPicker;

/* istanbul ignore next */
DatePicker.install = function (app: App) {
  app.component(DatePicker.name, DatePicker);
  app.component(RangePicker.name, RangePicker);
  app.component(MonthPicker.name, MonthPicker);
  app.component(WeekPicker.name, WeekPicker);
  app.component(QuarterPicker.name, QuarterPicker);
  return app;
};

export { RangePicker, WeekPicker, MonthPicker, QuarterPicker };

export default DatePicker as typeof DatePicker & Plugin;
