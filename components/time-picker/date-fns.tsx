import createTimePicker from './time-picker';
import dateFnsGenerateConfig from '../vc-picker/generate/dateFns';
import type { App } from 'vue';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';

const { TimePicker, TimeRangePicker } = createTimePicker<Date>(dateFnsGenerateConfig);

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Date>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}
export interface TimePickerProps extends Omit<PickerTimeProps<Date>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}

/* istanbul ignore next */
TimePicker.install = function (app: App) {
  app.component(TimePicker.name, TimePicker);
  app.component(TimeRangePicker.name, TimeRangePicker);
  return app;
};
TimePicker.TimeRangePicker = TimeRangePicker;

export { TimePicker, TimeRangePicker };

export default TimePicker as typeof TimePicker &
  Plugin & {
    readonly TimeRangePicker: typeof TimeRangePicker;
  };
