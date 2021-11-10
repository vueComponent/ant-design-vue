import type { Moment } from 'moment';
import type { App } from 'vue';
import momentGenerateConfig from '../vc-picker/generate/moment';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';

export type DatePickerProps = PickerProps<Moment> & ExtraDatePickerProps<Moment>;
export type MonthPickerProps = Omit<PickerDateProps<Moment>, 'picker'> &
  ExtraDatePickerProps<Moment>;
export type WeekPickerProps = Omit<PickerDateProps<Moment>, 'picker'> &
  ExtraDatePickerProps<Moment>;
export type RangePickerProps = BaseRangePickerProps<Moment> & ExtraRangePickerProps<Moment>;

const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker, RangePicker } =
  generatePicker<Moment>(momentGenerateConfig);

/* istanbul ignore next */
export { RangePicker, WeekPicker, MonthPicker, QuarterPicker };

export default Object.assign(DatePicker, {
  WeekPicker,
  MonthPicker,
  YearPicker,
  RangePicker,
  TimePicker,
  QuarterPicker,
  install: (app: App) => {
    app.component(DatePicker.name, DatePicker);
    app.component(RangePicker.name, RangePicker);
    app.component(MonthPicker.name, MonthPicker);
    app.component(WeekPicker.name, WeekPicker);
    app.component(QuarterPicker.name, QuarterPicker);
    return app;
  },
});
