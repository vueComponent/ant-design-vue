import type { ExtractPropTypes } from 'vue';
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
import omit from '../_util/omit';

import type { InputStatus } from '../_util/statusUtils';
import { booleanType, stringType } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

export const timePickerProps = () => ({
  format: String,
  showNow: booleanType(),
  showHour: booleanType(),
  showMinute: booleanType(),
  showSecond: booleanType(),
  use12Hours: booleanType(),
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  hideDisabledOptions: booleanType(),
  popupClassName: String,
  status: stringType<InputStatus>(),
});
type CommonTimePickerProps = Partial<ExtractPropTypes<ReturnType<typeof timePickerProps>>>;
export type TimeRangePickerProps<DateType> = Omit<
  RangePickerTimeProps<DateType>,
  'picker' | 'defaultPickerValue' | 'defaultValue' | 'value' | 'onChange' | 'onPanelChange' | 'onOk'
> & {
  popupClassName?: string;
  valueFormat?: string;
  defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
  defaultValue?: RangeValue<DateType> | RangeValue<string>;
  value?: RangeValue<DateType> | RangeValue<string>;
  onChange?: (
    value: RangeValue<DateType> | RangeValue<string> | null,
    dateString: [string, string],
  ) => void;
  'onUpdate:value'?: (value: RangeValue<DateType> | RangeValue<string> | null) => void;
  onPanelChange?: (
    values: RangeValue<DateType> | RangeValue<string>,
    modes: [PanelMode, PanelMode],
  ) => void;
  onOk?: (dates: RangeValue<DateType> | RangeValue<string>) => void;
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
    ...timePickerProps(),
    order: { type: Boolean, default: true },
  });

  const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker as any;
  
  const usePickerExpose = (pickerRef: Ref) => ({
    focus: () => pickerRef.value?.focus?.(),
    blur: () => pickerRef.value?.blur?.(),
  });

  const useFormItemEvents = (emit: any, formItemContext: any) => ({
    onChange: (value: any, dateString: any) => {
      emit('update:value', value);
      emit('change', value, dateString);
      formItemContext.onFieldChange();
    },
    onBlur: (e: FocusEvent) => {
      emit('blur', e);
      formItemContext.onFieldBlur();
    }
  });

  const useCommonEvents = (emit: any) => ({
    onOpenChange: (open: boolean) => {
      emit('update:open', open);
      emit('openChange', open);
    },
    onFocus: (e: FocusEvent) => {
      emit('focus', e);
    }
  });

  const TimePicker = defineComponent<DTimePickerProps>({
    name: 'ATimePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<any>(),
      ...datePickerProps<any>(),
      ...timePickerProps(),
      addon: { type: Function },
    } as any,
    slots: Object as CustomSlotsType<{
      addon?: any;
      renderExtraFooter?: any;
      suffixIcon?: any;
      clearIcon?: any;
      default: any;
    }>,
    setup(p, { slots, expose, emit, attrs }) {
      const props = p as unknown as DTimePickerProps;
      const formItemContext = useInjectFormItemContext();
      const pickerRef = ref();
      
      devWarning(
        !(slots.addon || props.addon),
        'TimePicker',
        '`addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.',
      );
      
      expose(usePickerExpose(pickerRef));
      
      const { onChange, onBlur } = useFormItemEvents(emit, formItemContext);
      const { onOpenChange, onFocus } = useCommonEvents(emit);
      
      const onOk = (value: DateType) => {
        emit('ok', value);
      };
      
      return () => {
        const { id = formItemContext.id.value } = props;
        const renderExtraFooter = props.addon || slots.addon || props.renderExtraFooter || slots.renderExtraFooter;
        const omittedProps = omit(props, ['onUpdate:value', 'onUpdate:open']);
        
        return (
          <InternalTimePicker
            {...attrs}
            {...omittedProps}
            id={id}
            dropdownClassName={props.popupClassName}
            mode={undefined}
            ref={pickerRef}
            renderExtraFooter={renderExtraFooter}
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

  const TimeRangePicker = defineComponent<DTimeRangePickerProps>({
    name: 'ATimeRangePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<any>(),
      ...rangePickerProps<any>(),
      ...timePickerProps(),
      order: { type: Boolean, default: true },
    } as any,
    slots: Object as CustomSlotsType<{
      renderExtraFooter?: any;
      suffixIcon?: any;
      clearIcon?: any;
      default: any;
    }>,
    setup(p, { slots, expose, emit, attrs }) {
      const props = p as unknown as DTimeRangePickerProps;
      const pickerRef = ref();
      const formItemContext = useInjectFormItemContext();
      
      expose(usePickerExpose(pickerRef));
      
      const { onChange, onBlur } = useFormItemEvents(emit, formItemContext);
      const { onOpenChange, onFocus } = useCommonEvents(emit);
      
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
        const { id = formItemContext.id.value } = props;
        const omittedProps = omit(props, ['onUpdate:open', 'onUpdate:value'] as any);
        
        return (
          <InternalRangePicker
            {...attrs}
            {...omittedProps}
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

  return {
    TimePicker,
    TimeRangePicker,
  };
}

export default createTimePicker;
