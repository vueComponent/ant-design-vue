import useMergedState from '../_util/hooks/useMergedState';
import { PickerPanel } from '../vc-picker';
import type { Locale } from '../vc-picker/interface';
import type { GenerateConfig } from '../vc-picker/generate';
import type {
  PickerPanelBaseProps as RCPickerPanelBaseProps,
  PickerPanelDateProps as RCPickerPanelDateProps,
  PickerPanelTimeProps as RCPickerPanelTimeProps,
} from '../vc-picker/PickerPanel';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import enUS from './locale/en_US';
import CalendarHeader from './Header';
import type { CustomSlotsType, VueNode } from '../_util/type';
import type { App, PropType } from 'vue';
import { computed, defineComponent, toRef } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';

// CSSINJS
import useStyle from './style';

type InjectDefaultProps<Props> = Omit<
  Props,
  'locale' | 'generateConfig' | 'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'
> & {
  locale?: typeof enUS;
  size?: 'large' | 'default' | 'small';
};

export interface SelectInfo {
  source: 'year' | 'month' | 'date' | 'customize';
}

// Picker Props
export type PickerPanelBaseProps<DateType> = InjectDefaultProps<RCPickerPanelBaseProps<DateType>>;
export type PickerPanelDateProps<DateType> = InjectDefaultProps<RCPickerPanelDateProps<DateType>>;
export type PickerPanelTimeProps<DateType> = InjectDefaultProps<RCPickerPanelTimeProps<DateType>>;

export type PickerProps<DateType> =
  | PickerPanelBaseProps<DateType>
  | PickerPanelDateProps<DateType>
  | PickerPanelTimeProps<DateType>;

export type CalendarMode = 'year' | 'month';
export type HeaderRender<DateType> = (config: {
  value: DateType;
  type: CalendarMode;
  onChange: (date: DateType) => void;
  onTypeChange: (type: CalendarMode) => void;
}) => VueNode;

type CustomRenderType<DateType> = (config: { current: DateType }) => VueNode;

export interface CalendarProps<DateType> {
  prefixCls?: string;
  locale?: typeof enUS;
  validRange?: [DateType, DateType];
  disabledDate?: (date: DateType) => boolean;
  dateFullCellRender?: CustomRenderType<DateType>;
  dateCellRender?: CustomRenderType<DateType>;
  monthFullCellRender?: CustomRenderType<DateType>;
  monthCellRender?: CustomRenderType<DateType>;
  headerRender?: HeaderRender<DateType>;
  value?: DateType | string;
  defaultValue?: DateType | string;
  mode?: CalendarMode;
  fullscreen?: boolean;
  onChange?: (date: DateType | string) => void;
  'onUpdate:value'?: (date: DateType | string) => void;
  onPanelChange?: (date: DateType | string, mode: CalendarMode) => void;
  onSelect?: (date: DateType, selectInfo: SelectInfo) => void;
  valueFormat?: string;
}

function generateCalendar<
  DateType,
  Props extends CalendarProps<DateType> = CalendarProps<DateType>,
>(generateConfig: GenerateConfig<DateType>) {
  function isSameYear(date1: DateType, date2: DateType) {
    return date1 && date2 && generateConfig.getYear(date1) === generateConfig.getYear(date2);
  }

  function isSameMonth(date1: DateType, date2: DateType) {
    return (
      isSameYear(date1, date2) && generateConfig.getMonth(date1) === generateConfig.getMonth(date2)
    );
  }

  function isSameDate(date1: DateType, date2: DateType) {
    return (
      isSameMonth(date1, date2) && generateConfig.getDate(date1) === generateConfig.getDate(date2)
    );
  }

  const Calendar = defineComponent<Props>({
    name: 'ACalendar',
    inheritAttrs: false,
    props: {
      prefixCls: String,
      locale: { type: Object as PropType<Props['locale']>, default: undefined as Props['locale'] },
      validRange: { type: Array as PropType<DateType[]>, default: undefined },
      disabledDate: { type: Function as PropType<Props['disabledDate']>, default: undefined },
      dateFullCellRender: {
        type: Function as PropType<Props['dateFullCellRender']>,
        default: undefined,
      },
      dateCellRender: { type: Function as PropType<Props['dateCellRender']>, default: undefined },
      monthFullCellRender: {
        type: Function as PropType<Props['monthFullCellRender']>,
        default: undefined,
      },
      monthCellRender: { type: Function as PropType<Props['monthCellRender']>, default: undefined },
      headerRender: { type: Function as PropType<Props['headerRender']>, default: undefined },
      value: {
        type: [Object, String] as PropType<Props['value']>,
        default: undefined as Props['value'],
      },
      defaultValue: {
        type: [Object, String] as PropType<Props['defaultValue']>,
        default: undefined as Props['defaultValue'],
      },
      mode: { type: String as PropType<Props['mode']>, default: undefined },
      fullscreen: { type: Boolean as PropType<Props['fullscreen']>, default: undefined },
      onChange: { type: Function as PropType<Props['onChange']>, default: undefined },
      'onUpdate:value': { type: Function as PropType<Props['onUpdate:value']>, default: undefined },
      onPanelChange: { type: Function as PropType<Props['onPanelChange']>, default: undefined },
      onSelect: { type: Function as PropType<Props['onSelect']>, default: undefined },
      valueFormat: { type: String, default: undefined },
    } as any,
    slots: Object as CustomSlotsType<{
      dateFullCellRender?: { current: DateType };
      dateCellRender?: { current: DateType };
      monthFullCellRender?: { current: DateType };
      monthCellRender?: { current: DateType };
      headerRender?: {
        value: DateType;
        type: CalendarMode;
        onChange: (date: DateType) => void;
        onTypeChange: (type: CalendarMode) => void;
      };
      default: any;
    }>,
    setup(p, { emit, slots, attrs }) {
      const props = p as unknown as Props;
      const { prefixCls, direction } = useConfigInject('picker', props);

      // style
      const [wrapSSR, hashId] = useStyle(prefixCls);

      const calendarPrefixCls = computed(() => `${prefixCls.value}-calendar`);
      const maybeToString = (date: DateType) => {
        return props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
      };
      const value = computed(() => {
        if (props.value) {
          return props.valueFormat
            ? (generateConfig.toDate(props.value, props.valueFormat) as DateType)
            : (props.value as DateType);
        }
        return (props.value === '' ? undefined : props.value) as DateType;
      });
      const defaultValue = computed(() => {
        if (props.defaultValue) {
          return props.valueFormat
            ? (generateConfig.toDate(props.defaultValue, props.valueFormat) as DateType)
            : (props.defaultValue as DateType);
        }
        return (props.defaultValue === '' ? undefined : props.defaultValue) as DateType;
      });

      // Value
      const [mergedValue, setMergedValue] = useMergedState(
        () => value.value || generateConfig.getNow(),
        {
          defaultValue: defaultValue.value,
          value,
        },
      );

      // Mode
      const [mergedMode, setMergedMode] = useMergedState('month', {
        value: toRef(props, 'mode'),
      });

      const panelMode = computed(() => (mergedMode.value === 'year' ? 'month' : 'date'));

      const mergedDisabledDate = computed(() => {
        return (date: DateType) => {
          const notInRange = props.validRange
            ? generateConfig.isAfter(props.validRange[0], date) ||
              generateConfig.isAfter(date, props.validRange[1])
            : false;
          return notInRange || !!props.disabledDate?.(date);
        };
      });

      // ====================== Events ======================
      const triggerPanelChange = (date: DateType, newMode: CalendarMode) => {
        emit('panelChange', maybeToString(date), newMode);
      };

      const triggerChange = (date: DateType) => {
        setMergedValue(date);

        if (!isSameDate(date, mergedValue.value)) {
          // Trigger when month panel switch month
          if (
            (panelMode.value === 'date' && !isSameMonth(date, mergedValue.value)) ||
            (panelMode.value === 'month' && !isSameYear(date, mergedValue.value))
          ) {
            triggerPanelChange(date, mergedMode.value);
          }
          const val = maybeToString(date);
          emit('update:value', val);
          emit('change', val);
        }
      };

      const triggerModeChange = (newMode: CalendarMode) => {
        setMergedMode(newMode);
        triggerPanelChange(mergedValue.value, newMode);
      };

      const onInternalSelect = (date: DateType, source: SelectInfo['source']) => {
        triggerChange(date);
        emit('select', maybeToString(date), { source });
      };
      // ====================== Locale ======================
      const defaultLocale = computed(() => {
        const { locale } = props;
        const result = {
          ...enUS,
          ...locale,
        };
        result.lang = {
          ...result.lang,
          ...(locale || {}).lang,
        };
        return result;
      });

      const [mergedLocale] = useLocaleReceiver('Calendar', defaultLocale) as [typeof defaultLocale];

      return () => {
        const today = generateConfig.getNow();
        const {
          dateFullCellRender = slots?.dateFullCellRender,
          dateCellRender = slots?.dateCellRender,
          monthFullCellRender = slots?.monthFullCellRender,
          monthCellRender = slots?.monthCellRender,
          headerRender = slots?.headerRender,
          fullscreen = true,
          validRange,
        } = props;
        // ====================== Render ======================
        const dateRender = ({ current: date }) => {
          if (dateFullCellRender) {
            return dateFullCellRender({ current: date });
          }
          return (
            <div
              class={classNames(
                `${prefixCls.value}-cell-inner`,
                `${calendarPrefixCls.value}-date`,
                {
                  [`${calendarPrefixCls.value}-date-today`]: isSameDate(today, date),
                },
              )}
            >
              <div class={`${calendarPrefixCls.value}-date-value`}>
                {String(generateConfig.getDate(date)).padStart(2, '0')}
              </div>
              <div class={`${calendarPrefixCls.value}-date-content`}>
                {dateCellRender && dateCellRender({ current: date })}
              </div>
            </div>
          );
        };

        const monthRender = ({ current: date }, locale: Locale) => {
          if (monthFullCellRender) {
            return monthFullCellRender({ current: date });
          }

          const months = locale.shortMonths || generateConfig.locale.getShortMonths!(locale.locale);

          return (
            <div
              class={classNames(
                `${prefixCls.value}-cell-inner`,
                `${calendarPrefixCls.value}-date`,
                {
                  [`${calendarPrefixCls.value}-date-today`]: isSameMonth(today, date),
                },
              )}
            >
              <div class={`${calendarPrefixCls.value}-date-value`}>
                {months[generateConfig.getMonth(date)]}
              </div>
              <div class={`${calendarPrefixCls.value}-date-content`}>
                {monthCellRender && monthCellRender({ current: date })}
              </div>
            </div>
          );
        };
        return wrapSSR(
          <div
            {...attrs}
            class={classNames(
              calendarPrefixCls.value,
              {
                [`${calendarPrefixCls.value}-full`]: fullscreen,
                [`${calendarPrefixCls.value}-mini`]: !fullscreen,
                [`${calendarPrefixCls.value}-rtl`]: direction.value === 'rtl',
              },
              attrs.class,
              hashId.value,
            )}
          >
            {headerRender ? (
              headerRender({
                value: mergedValue.value,
                type: mergedMode.value,
                onChange: nextDate => {
                  onInternalSelect(nextDate, 'customize');
                },
                onTypeChange: triggerModeChange,
              })
            ) : (
              <CalendarHeader
                prefixCls={calendarPrefixCls.value}
                value={mergedValue.value}
                generateConfig={generateConfig}
                mode={mergedMode.value}
                fullscreen={fullscreen}
                locale={mergedLocale.value.lang}
                validRange={validRange}
                onChange={onInternalSelect}
                onModeChange={triggerModeChange}
              />
            )}
            <PickerPanel
              value={mergedValue.value}
              prefixCls={prefixCls.value}
              locale={mergedLocale.value.lang}
              generateConfig={generateConfig}
              dateRender={dateRender}
              monthCellRender={obj => monthRender(obj, mergedLocale.value.lang)}
              onSelect={nextDate => {
                onInternalSelect(nextDate, panelMode.value);
              }}
              mode={panelMode.value}
              picker={panelMode.value}
              disabledDate={mergedDisabledDate.value}
              hideHeader
            />
          </div>,
        );
      };
    },
  });

  Calendar.install = function (app: App) {
    app.component(Calendar.name, Calendar);
    return app;
  };

  return Calendar;
}

export default generateCalendar;
