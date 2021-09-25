import { defineComponent, ref } from 'vue';
import type { RangePickerTimeProps } from '../date-picker/generatePicker';
import generatePicker from '../date-picker/generatePicker';
import {
  commonProps,
  datePickerProps,
  rangePickerProps,
} from '../date-picker/generatePicker/props';
import type { CommonProps, DatePickerProps } from '../date-picker/generatePicker/props';
import type { GenerateConfig } from '../vc-picker/generate';
import type { PanelMode, RangeValue } from '../vc-picker/interface';
import type { RangePickerSharedProps } from '../vc-picker/RangePicker';
import devWarning from '../vc-util/devWarning';
import { useInjectFormItemContext } from '../form/FormItemContext';

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

const timePickerProps = {
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

export interface CommonTimePickerProps {
  format?: string;
  showNow?: boolean;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  hideDisabledOptions?: boolean;
  popupClassName?: string;
}

export type TimeRangePickerProps<T> = Omit<RangePickerTimeProps<T>, 'picker'> & {
  popupClassName?: string;
  valueFormat?: string;
};

export type TimePickerProps<DateType> = CommonProps<DateType> &
  DatePickerProps<DateType> &
  CommonTimePickerProps & {
    addon?: () => void;
  };

function createTimePicker<
  DateType,
  DTimePickerProps extends TimePickerProps<DateType> = TimePickerProps<DateType>,
  DTimeRangePickerProps extends TimeRangePickerProps<DateType> = TimeRangePickerProps<DateType>,
>(generateConfig: GenerateConfig<DateType>) {
  const DatePicker = generatePicker<DateType>(generateConfig, {
    ...timePickerProps,
    order: { type: Boolean, default: true },
  });

  const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker as any;

  const TimePicker = defineComponent<DTimePickerProps>({
    name: 'ATimePicker',
    inheritAttrs: false,
    slot: ['addon', 'renderExtraFooter', 'suffixIcon', 'clearIcon'],
    emits: ['change', 'openChange', 'focus', 'blur', 'ok', 'update:value', 'update:open'],
    setup(props, { slots, expose, emit, attrs }) {
      const formItemContext = useInjectFormItemContext();
      devWarning(
        !(slots.addon || props.addon),
        'TimePicker',
        '`addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.',
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
        formItemContext.onFieldChange();
      };
      const onOpenChange = (open: boolean) => {
        emit('update:open', open);
        emit('openChange', open);
      };
      const onFocus = () => {
        emit('focus');
      };
      const onBlur = () => {
        emit('blur');
        formItemContext.onFieldBlur();
      };
      const onOk = (value: DateType) => {
        emit('ok', value);
      };
      return () => {
        const { id = formItemContext.id.value, ...restProps } = props;
        return (
          <InternalTimePicker
            {...attrs}
            {...restProps}
            id={id}
            dropdownClassName={props.popupClassName}
            mode={undefined}
            ref={pickerRef}
            renderExtraFooter={
              props.addon || slots.addon || props.renderExtraFooter || slots.renderExtraFooter
            }
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onOk={onOk}
            v-slots={slots}
          />
        );
      };
    },
  });

  TimePicker.props = {
    ...commonProps<DateType>(),
    ...datePickerProps<DateType>(),
    ...timePickerProps,
    addon: { type: Function },
  };

  const TimeRangePicker = defineComponent<DTimeRangePickerProps>({
    name: 'ATimeRangePicker',
    inheritAttrs: false,
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

      const formItemContext = useInjectFormItemContext();

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
        formItemContext.onFieldChange();
      };
      const onOpenChange = (open: boolean) => {
        emit('update:open', open);
        emit('openChange', open);
      };
      const onFocus = () => {
        emit('focus');
      };
      const onBlur = () => {
        emit('blur');
        formItemContext.onFieldBlur();
      };
      const onPanelChange = (
        values: RangeValue<string> | RangeValue<DateType>,
        modes: [PanelMode, PanelMode],
      ) => {
        emit('panelChange', values, modes);
      };
      const onOk = (values: RangeValue<string | DateType>) => {
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
        const { id = formItemContext.id.value, ...restProps } = props;
        return (
          <InternalRangePicker
            {...attrs}
            {...restProps}
            id={id}
            dropdownClassName={props.popupClassName}
            picker="time"
            mode={undefined}
            ref={pickerRef}
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFocus}
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

  TimeRangePicker.props = {
    ...commonProps<DateType>(),
    ...rangePickerProps<DateType>(),
    ...timePickerProps,
    order: { type: Boolean, default: true },
  };

  return {
    TimePicker,
    TimeRangePicker,
  };
}

export default createTimePicker;
