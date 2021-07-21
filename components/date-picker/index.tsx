import type { Moment } from 'moment';
import { App } from 'vue';
import momentGenerateConfig from '../vc-picker/generate/moment';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';

export type DatePickerProps = PickerProps<Moment>;
export type MonthPickerProps = Omit<PickerDateProps<Moment>, 'picker'>;
export type WeekPickerProps = Omit<PickerDateProps<Moment>, 'picker'>;
export type RangePickerProps = BaseRangePickerProps<Moment>;

const DatePicker = generatePicker<Moment>(momentGenerateConfig);

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
