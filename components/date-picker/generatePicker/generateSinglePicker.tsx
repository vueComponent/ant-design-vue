import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import RCPicker from '../../vc-picker';
import type { PanelMode, PickerMode } from '../../vc-picker/interface';
import type { GenerateConfig } from '../../vc-picker/generate/index';
import enUS from '../locale/en_US';
import { getPlaceholder } from '../util';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import type { PickerProps, PickerDateProps, PickerTimeProps } from '.';
import { getTimeProps, Components } from '.';
import type { DefineComponent } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import useConfigInject from '../../_util/hooks/useConfigInject';
import classNames from '../../_util/classNames';
import type { ExtraDatePickerProps } from './props';
import { commonProps, datePickerProps } from './props';
import devWarning from '../../vc-util/devWarning';

export default function generatePicker<DateType>(
  generateConfig: GenerateConfig<DateType>,
  extraProps: Record<string, any> = {},
) {
  type DatePickerProps = PickerProps<DateType> & ExtraDatePickerProps<DateType>;

  function getPicker<InnerPickerProps extends DatePickerProps>(
    picker?: PickerMode,
    displayName?: string,
  ): DefineComponent<InnerPickerProps> {
    return defineComponent<InnerPickerProps>({
      name: displayName,
      inheritAttrs: false,
      props: {
        ...commonProps<DateType>(),
        ...datePickerProps<DateType>(),
        ...extraProps,
      } as any,
      slots: [
        'suffixIcon',
        // 'clearIcon',
        // 'prevIcon',
        // 'nextIcon',
        // 'superPrevIcon',
        // 'superNextIcon',
        // 'panelRender',
        'dateRender',
        'renderExtraFooter',
        'monthCellRender',
      ],
      emits: [
        'change',
        'openChange',
        'focus',
        'blur',
        'panelChange',
        'ok',
        'update:value',
        'update:open',
      ],
      setup(props, { slots, expose, attrs, emit }) {
        devWarning(
          !((props as any).monthCellContentRender || slots.monthCellContentRender),
          'DatePicker',
          '`monthCellContentRender` is deprecated. Please use `monthCellRender"` instead.',
        );

        devWarning(
          !(attrs as any).getCalendarContainer,
          'DatePicker',
          '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.',
        );
        const { prefixCls, direction, getPopupContainer, size, rootPrefixCls } = useConfigInject(
          'picker',
          props,
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
        const onChange = (date: DateType, dateString: string) => {
          const value = props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
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
        const onPanelChange = (date: DateType, mode: PanelMode | null) => {
          const value = props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
          emit('panelChange', value, mode);
        };
        const onOk = (date: DateType) => {
          const value = props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
          emit('ok', value);
        };

        const [contextLocale] = useLocaleReceiver('DatePicker', enUS);

        const value = computed(() => {
          if (props.value) {
            return props.valueFormat
              ? generateConfig.toDate(props.value, props.valueFormat)
              : props.value;
          }
          return props.value;
        });
        const defaultValue = computed(() => {
          if (props.defaultValue) {
            return props.valueFormat
              ? generateConfig.toDate(props.defaultValue, props.valueFormat)
              : props.defaultValue;
          }
          return props.defaultValue;
        });
        const defaultPickerValue = computed(() => {
          if (props.defaultPickerValue) {
            return props.valueFormat
              ? generateConfig.toDate(props.defaultPickerValue, props.valueFormat)
              : props.defaultPickerValue;
          }
          return props.defaultPickerValue;
        });

        return () => {
          const locale = { ...contextLocale.value, ...props.locale };
          const p = { ...props, ...attrs } as InnerPickerProps;
          const {
            bordered = true,
            placeholder,
            suffixIcon = slots.suffixIcon?.(),
            showToday = true,
            transitionName,
            allowClear = true,
            dateRender = slots.dateRender,
            renderExtraFooter = slots.renderExtraFooter,
            monthCellRender = slots.monthCellRender ||
              (props as any).monthCellContentRender ||
              slots.monthCellContentRender,
            clearIcon = slots.clearIcon?.(),
            ...restProps
          } = p;
          const showTime = p.showTime === '' ? true : p.showTime;
          const { format } = p as any;

          let additionalOverrideProps: any = {};
          if (picker) {
            additionalOverrideProps.picker = picker;
          }
          const mergedPicker = picker || p.picker || 'date';

          additionalOverrideProps = {
            ...additionalOverrideProps,
            ...(showTime
              ? getTimeProps({
                  format,
                  picker: mergedPicker,
                  ...(typeof showTime === 'object' ? showTime : {}),
                })
              : {}),
            ...(mergedPicker === 'time'
              ? getTimeProps({ format, ...restProps, picker: mergedPicker })
              : {}),
          };
          const pre = prefixCls.value;
          return (
            <RCPicker
              monthCellRender={props.monthCellRender}
              dateRender={dateRender}
              renderExtraFooter={renderExtraFooter}
              ref={pickerRef}
              placeholder={getPlaceholder(mergedPicker, locale, placeholder)}
              suffixIcon={
                suffixIcon ||
                (mergedPicker === 'time' ? <ClockCircleOutlined /> : <CalendarOutlined />)
              }
              clearIcon={clearIcon || <CloseCircleFilled />}
              allowClear={allowClear}
              transitionName={transitionName || `${rootPrefixCls.value}-slide-up`}
              {...restProps}
              {...additionalOverrideProps}
              picker={mergedPicker}
              value={value.value}
              defaultValue={defaultValue.value}
              defaultPickerValue={defaultPickerValue.value}
              showToday={showToday}
              locale={locale!.lang}
              class={classNames(
                {
                  [`${pre}-${size.value}`]: size.value,
                  [`${pre}-borderless`]: !bordered,
                },
                attrs.class,
              )}
              prefixCls={pre}
              getPopupContainer={attrs.getCalendarContainer || getPopupContainer.value}
              generateConfig={generateConfig}
              prevIcon={<span class={`${pre}-prev-icon`} />}
              nextIcon={<span class={`${pre}-next-icon`} />}
              superPrevIcon={<span class={`${pre}-super-prev-icon`} />}
              superNextIcon={<span class={`${pre}-super-next-icon`} />}
              components={Components}
              direction={direction.value}
              onChange={onChange}
              onOpenChange={onOpenChange}
              onFocus={onFoucs}
              onBlur={onBlur}
              onPanelChange={onPanelChange}
              onOk={onOk}
            />
          );
        };
      },
    }) as unknown as DefineComponent<InnerPickerProps>;
  }

  const DatePicker = getPicker<DatePickerProps>(undefined, 'ADatePicker');
  const WeekPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('week', 'AWeekPicker');
  const MonthPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('month', 'AMonthPicker');
  const YearPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('year', 'AYearPicker');
  const TimePicker = getPicker<Omit<PickerTimeProps<DateType>, 'picker'>>('time', 'TimePicker'); // 给独立组件 TimePicker 使用，此处名称不用更改
  const QuarterPicker = getPicker<Omit<PickerTimeProps<DateType>, 'picker'>>(
    'quarter',
    'AQuarterPicker',
  );

  return { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker };
}
