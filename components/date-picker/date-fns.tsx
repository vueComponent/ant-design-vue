import type { App } from 'vue';
import dataFnsGenerateConfig from '../vc-picker/generate/dateFns';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';

export type DatePickerProps = PickerProps<Date> & ExtraDatePickerProps<Date>;
export type MonthPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type WeekPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type RangePickerProps = BaseRangePickerProps<Date> & ExtraRangePickerProps<Date>;

const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker, RangePicker } =
  generatePicker<Date>(dataFnsGenerateConfig);

DatePicker.WeekPicker = WeekPicker;
DatePicker.MonthPicker = MonthPicker;
DatePicker.YearPicker = YearPicker;
DatePicker.RangePicker = RangePicker;
DatePicker.TimePicker = TimePicker;
DatePicker.QuarterPicker = QuarterPicker;

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

export default DatePicker as typeof DatePicker &
  Plugin & {
    readonly RangePicker: typeof RangePicker;
    readonly MonthPicker: typeof MonthPicker;
    readonly WeekPicker: typeof WeekPicker;
    readonly QuarterPicker: typeof QuarterPicker;
  };
