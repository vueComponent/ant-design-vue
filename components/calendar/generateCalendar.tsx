import useMergedState from '../_util/hooks/useMergedState';
import padStart from 'lodash-es/padStart';
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
import type { VueNode } from '../_util/type';
import type { App } from 'vue';
import { computed, defineComponent, toRef } from 'vue';
import useConfigInject from '../_util/hooks/useConfigInject';
import classNames from '../_util/classNames';

type InjectDefaultProps<Props> = Omit<
  Props,
  'locale' | 'generateConfig' | 'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'
> & {
  locale?: typeof enUS;
  size?: 'large' | 'default' | 'small';
};

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
  onPanelChange?: (date: DateType | string, mode: CalendarMode) => void;
  onSelect?: (date: DateType | string) => void;
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
    emits: ['change', 'panelChange', 'select', 'update:value'],
    slots: [
      'dateFullCellRender',
      'dateCellRender',
      'monthFullCellRender',
      'monthCellRender',
      'headerRender',
    ],
    setup(props, { emit, slots, attrs }) {
      const { prefixCls, direction } = useConfigInject('picker', props);
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
        return props.value as DateType;
      });
      const defaultValue = computed(() => {
        if (props.defaultValue) {
          return props.valueFormat
            ? (generateConfig.toDate(props.defaultValue, props.valueFormat) as DateType)
            : (props.defaultValue as DateType);
        }
        return props.defaultValue as DateType;
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

      const onInternalSelect = (date: DateType) => {
        triggerChange(date);
        emit('select', maybeToString(date));
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
                {padStart(String(generateConfig.getDate(date)), 2, '0')}
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
        return (
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
            )}
          >
            {headerRender ? (
              headerRender({
                value: mergedValue.value,
                type: mergedMode.value,
                onChange: onInternalSelect,
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
              onSelect={onInternalSelect}
              mode={panelMode.value}
              picker={panelMode.value}
              disabledDate={mergedDisabledDate.value}
              hideHeader
            />
          </div>
        );
      };
    },
  });

  Calendar.props = [
    'prefixCls',
    'locale',
    'validRange',
    'disabledDate',
    'dateFullCellRender',
    'dateCellRender',
    'monthFullCellRender',
    'monthCellRender',
    'headerRender',
    'value',
    'defaultValue',
    'mode',
    'fullscreen',
    'onChange',
    'onPanelChange',
    'onSelect',
    'valueFormat',
  ];

  Calendar.install = function (app: App) {
    app.component(Calendar.name, Calendar);
    return app;
  };

  return Calendar;
}

export default generateCalendar;
