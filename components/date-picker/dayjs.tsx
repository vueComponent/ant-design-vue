import type { Dayjs } from 'dayjs';
import type { App } from 'vue';
import dayjsGenerateConfig from '../vc-picker/generate/dayjs';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';

export type DatePickerProps = PickerProps<Dayjs> & ExtraDatePickerProps<Dayjs>;
export type MonthPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'> & ExtraDatePickerProps<Dayjs>;
export type WeekPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'> & ExtraDatePickerProps<Dayjs>;
export type RangePickerProps = BaseRangePickerProps<Dayjs> & ExtraRangePickerProps<Dayjs>;

const {
  DatePicker: ADatePicker,
  WeekPicker: AWeekPicker,
  MonthPicker: AMonthPicker,
  YearPicker: AYearPicker,
  TimePicker: ATimePicker,
  QuarterPicker: AQuarterPicker,
  RangePicker: ARangePicker,
} = generatePicker<Dayjs>(dayjsGenerateConfig);

/* istanbul ignore next */
export { ARangePicker, AWeekPicker, AMonthPicker, AQuarterPicker };

export default Object.assign(ADatePicker, {
  AWeekPicker,
  AMonthPicker,
  AYearPicker,
  ARangePicker,
  ATimePicker,
  AQuarterPicker,
  install: (app: App) => {
    app.component(ADatePicker.name, ADatePicker);
    app.component(ARangePicker.name, ARangePicker);
    app.component(AMonthPicker.name, AMonthPicker);
    app.component(AWeekPicker.name, AWeekPicker);
    app.component(AQuarterPicker.name, AQuarterPicker);
    return app;
  },
});
