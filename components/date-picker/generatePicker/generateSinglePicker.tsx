import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import RCPicker from '../../vc-picker';
import type { DisabledTime, PanelMode, PickerMode } from '../../vc-picker/interface';
import type { GenerateConfig } from '../../vc-picker/generate/index';
import enUS from '../locale/en_US';
import { getPlaceholder } from '../util';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import type { PickerProps, PickerDateProps, PickerTimeProps, PickerLocale } from '.';
import { getTimeProps, Components } from '.';
import { CSSProperties, defineComponent, PropType, ref } from 'vue';
import useConfigInject from '../../_util/hooks/useConfigInject';
import classNames from '../../_util/classNames';
import { AlignType } from '../../vc-align/interface';
import { VueNode } from '../../_util/type';
import { SharedTimeProps } from '../../vc-picker/panels/TimePanel';
import { SizeType } from '../../config-provider';
import { DateRender } from '../../vc-picker/panels/DatePanel/DateBody';
import { commonProps } from './props';

export default function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  type DatePickerProps = PickerProps<DateType>;

  function getPicker<InnerPickerProps extends DatePickerProps>(
    picker?: PickerMode,
    displayName?: string,
  ) {
    return defineComponent<InnerPickerProps>({
      name: displayName,
      inheritAttrs: false,
      props: {
        ...commonProps<DateType>(),
      } as any,
      slots: ['suffixIcon', 'panelRender', 'dateRender'],
      emits: ['change', 'openChange', 'focus', 'blur', 'panelChange', 'ok', 'update:value'],
      setup(props, { slots, expose, attrs, emit }) {
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
          emit('update:value', date);
          emit('change', date, dateString);
        };

        const [contextLocale] = useLocaleReceiver('DatePicker', enUS);
        return () => {
          const locale = { ...contextLocale.value, ...props.locale };
          const p = { ...props, ...attrs } as InnerPickerProps;
          const {
            bordered = true,
            placeholder,
            suffixIcon = slots.suffixIcon?.(),
            showToday = true,
            ...restProps
          } = p;
          const showTime = p.showTime === '' ? true : p.showTime;
          const { format } = p as any;

          let additionalOverrideProps: any = {};
          if (picker) {
            additionalOverrideProps.picker = picker;
          }
          const mergedPicker = picker || p.picker;

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
              ? getTimeProps({ format, ...p, picker: mergedPicker })
              : {}),
          };
          const pre = prefixCls.value;
          return (
            <RCPicker<DateType>
              ref={pickerRef}
              placeholder={getPlaceholder(mergedPicker, locale, placeholder)}
              suffixIcon={
                suffixIcon ||
                (mergedPicker === 'time' ? <ClockCircleOutlined /> : <CalendarOutlined />)
              }
              clearIcon={<CloseCircleFilled />}
              allowClear
              transitionName={`${rootPrefixCls.value}-slide-up`}
              {...restProps}
              {...additionalOverrideProps}
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
              getPopupContainer={getPopupContainer.value}
              generateConfig={generateConfig}
              prevIcon={<span class={`${pre}-prev-icon`} />}
              nextIcon={<span class={`${pre}-next-icon`} />}
              superPrevIcon={<span class={`${pre}-super-prev-icon`} />}
              superNextIcon={<span class={`${pre}-super-next-icon`} />}
              components={Components}
              direction={direction.value}
              onChange={onChange}
            />
          );
        };
      },
    });
  }

  const DatePicker = getPicker<DatePickerProps>('date', 'ADatePicker');
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
