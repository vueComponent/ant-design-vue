import { defineComponent, ref } from 'vue';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';
import generatePicker from '../date-picker/generatePicker';
import {
  commonProps,
  datePickerProps,
  rangePickerProps,
} from '../date-picker/generatePicker/props';
import type { GenerateConfig } from '../vc-picker/generate';
import type { PanelMode, RangeValue } from '../vc-picker/interface';
import type { RangePickerSharedProps } from '../vc-picker/RangePicker';
import devWarning from '../vc-util/devWarning';

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

const timpePickerProps = {
  format: String,
  showNow: { type: Boolean, default: undefined },
  showHour: { type: Boolean, default: undefined },
  showMinute: { type: Boolean, default: undefined },
  showSecond: { type: Boolean, default: undefined },
  use12Hours: { type: Boolean, default: undefined },
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  hideDisabledOptions: { type: Boolean, default: undefined },
  popupClassName: String,
};

function createTimePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  const DatePicker = generatePicker<DateType>(generateConfig, {
    ...timpePickerProps,
    order: { type: Boolean, default: true },
  });
  const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker as any;
  type TimeRangePickerProps = Omit<RangePickerTimeProps<DateType>, 'picker'> & {
    popupClassName?: string;
    valueFormat?: string;
  };
  type TimePickerProps = Omit<PickerTimeProps<DateType>, 'picker'> & {
    popupClassName?: string;
    valueFormat?: string;
  };
  const TimePicker = defineComponent<TimePickerProps>({
    name: 'ATimePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<DateType>(),
      ...datePickerProps<DateType>(),
      ...timpePickerProps,
    } as any,
    slot: ['addon', 'renderExtraFooter', 'suffixIcon', 'clearIcon'],
    emits: ['change', 'openChange', 'focus', 'blur', 'ok', 'update:value', 'update:open'],
    setup(props, { slots, expose, emit, attrs }) {
      devWarning(
        !slots.addon,
        'TimePicker',
        '`addon` is deprecated. Please use `renderExtraFooter` instead.',
      );
      const pickerRef = ref();
      expose({
        focus: () => {
          pickerRef.value?.focus();
        },
        blur: () => {
          pickerRef.value?.blur();
        },
      });
      const onChange = (value: DateType | string, dateString: string) => {
        emit('update:value', value);
        emit('change', value, dateString);
      };
      const onOpenChange = (open: boolean) => {
        emit('update:open', open);
        emit('openChange', open);
      };
      const onFoucs = () => {
        emit('focus');
      };
      const onBlur = () => {
        emit('blur');
      };
      const onOk = (value: DateType) => {
        emit('ok', value);
      };
      return () => {
        return (
          <InternalTimePicker
            {...attrs}
            {...props}
            dropdownClassName={props.popupClassName}
            mode={undefined}
            ref={pickerRef}
            renderExtraFooter={slots.addon ?? props.renderExtraFooter ?? slots.renderExtraFooter}
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFoucs}
            onBlur={onBlur}
            onOk={onOk}
            v-slots={slots}
          />
        );
      };
    },
  });

  const TimeRangePicker = defineComponent<TimeRangePickerProps>({
    name: 'ATimeRangePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<DateType>(),
      ...rangePickerProps<DateType>(),
      ...timpePickerProps,
      order: { type: Boolean, default: true },
    } as any,
    slot: ['renderExtraFooter', 'suffixIcon', 'clearIcon'],
    emits: [
      'change',
      'panelChange',
      'ok',
      'openChange',
      'update:value',
      'update:open',
      'calendarChange',
      'focus',
      'blur',
    ],
    setup(props, { slots, expose, emit, attrs }) {
      const pickerRef = ref();
      expose({
        focus: () => {
          pickerRef.value?.focus();
        },
        blur: () => {
          pickerRef.value?.blur();
        },
      });
      const onChange = (
        values: RangeValue<string> | RangeValue<DateType>,
        dateStrings: [string, string],
      ) => {
        emit('update:value', values);
        emit('change', values, dateStrings);
      };
      const onOpenChange = (open: boolean) => {
        emit('update:open', open);
        emit('openChange', open);
      };
      const onFoucs = () => {
        emit('focus');
      };
      const onBlur = () => {
        emit('blur');
      };
      const onPanelChange = (
        values: RangeValue<string> | RangeValue<DateType>,
        modes: [PanelMode, PanelMode],
      ) => {
        emit('panelChange', values, modes);
      };
      const onOk = (values: RangeValue<string> | RangeValue<DateType>) => {
        emit('ok', values);
      };
      const onCalendarChange: RangePickerSharedProps<DateType>['onCalendarChange'] = (
        values: RangeValue<string> | RangeValue<DateType>,
        dateStrings: [string, string],
        info,
      ) => {
        emit('calendarChange', values, dateStrings, info);
      };
      return () => {
        return (
          <InternalRangePicker
            {...attrs}
            {...props}
            dropdownClassName={props.popupClassName}
            picker="time"
            mode={undefined}
            ref={pickerRef}
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFoucs}
            onBlur={onBlur}
            onPanelChange={onPanelChange}
            onOk={onOk}
            onCalendarChange={onCalendarChange}
            v-slots={slots}
          />
        );
      };
    },
  });

  return {
    TimePicker,
    TimeRangePicker,
  };
}

export default createTimePicker;
