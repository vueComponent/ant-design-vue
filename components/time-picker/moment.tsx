import { Moment } from 'moment';
import createTimePicker from './time-picker';
import momentGenerateConfig from '../vc-picker/generate/moment';
import { App } from 'vue';
import { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';

const { TimePicker, TimeRangePicker } = createTimePicker<Moment>(momentGenerateConfig);

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Moment>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}
export interface TimePickerProps extends Omit<PickerTimeProps<Moment>, 'picker'> {
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
