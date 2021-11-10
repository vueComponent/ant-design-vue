import type { Dayjs } from 'dayjs';
import createTimePicker from './time-picker';
import dayjsGenerateConfig from '../vc-picker/generate/dayjs';
import type { App } from 'vue';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';

const { TimePicker, TimeRangePicker } = createTimePicker<Dayjs>(dayjsGenerateConfig);

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Dayjs>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}
export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}

/* istanbul ignore next */
export { TimePicker, TimeRangePicker };
export default Object.assign(TimePicker, {
  TimePicker,
  TimeRangePicker,
  install: (app: App) => {
    app.component(TimePicker.name, TimePicker);
    app.component(TimeRangePicker.name, TimeRangePicker);
    return app;
  },
});
