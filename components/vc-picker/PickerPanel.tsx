/**
 * Logic:
 *  When `mode` === `picker`,
 *  click will trigger `onSelect` (if value changed trigger `onChange` also).
 *  Panel change will not trigger `onSelect` but trigger `onPanelChange`
 */
import type { SharedTimeProps } from './panels/TimePanel';
import TimePanel from './panels/TimePanel';
import DatetimePanel from './panels/DatetimePanel';
import DatePanel from './panels/DatePanel';
import WeekPanel from './panels/WeekPanel';
import MonthPanel from './panels/MonthPanel';
import QuarterPanel from './panels/QuarterPanel';
import YearPanel from './panels/YearPanel';
import DecadePanel from './panels/DecadePanel';
import type { GenerateConfig } from './generate';
import type {
  Locale,
  PanelMode,
  PanelRefProps,
  PickerMode,
  DisabledTime,
  OnPanelChange,
  Components,
} from './interface';
import { isEqual } from './utils/dateUtil';
import { useInjectPanel, useProvidePanel } from './PanelContext';
import type { DateRender } from './panels/DatePanel/DateBody';
import { PickerModeMap } from './utils/uiUtil';
import type { MonthCellRender } from './panels/MonthPanel/MonthBody';
import { useInjectRange } from './RangeContext';
import getExtraFooter from './utils/getExtraFooter';
import getRanges from './utils/getRanges';
import { getLowerBoundTime, setDateTime, setTime } from './utils/timeUtil';
import type { VueNode } from '../_util/type';
import type { CSSProperties } from 'vue';
import { computed, createVNode, defineComponent, ref, toRef, watch, watchEffect } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { warning } from '../vc-util/warning';
import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';

export type PickerPanelSharedProps<DateType> = {
  prefixCls?: string;
  // className?: string;
  // style?: React.CSSProperties;
  /** @deprecated Will be removed in next big version. Please use `mode` instead */
  mode?: PanelMode;
  tabindex?: number;

  // Locale
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;

  // Value
  value?: DateType | null;
  defaultValue?: DateType;
  /** [Legacy] Set default display picker view date */
  pickerValue?: DateType;
  /** [Legacy] Set default display picker view date */
  defaultPickerValue?: DateType;

  // Date
  disabledDate?: (date: DateType) => boolean;

  // Render
  dateRender?: DateRender<DateType>;
  monthCellRender?: MonthCellRender<DateType>;
  renderExtraFooter?: (mode: PanelMode) => VueNode;

  // Event
  onSelect?: (value: DateType) => void;
  onChange?: (value: DateType) => void;
  onPanelChange?: OnPanelChange<DateType>;
  onMousedown?: (e: MouseEvent) => void;
  onOk?: (date: DateType) => void;

  direction?: 'ltr' | 'rtl';

  /** @private This is internal usage. Do not use in your production env */
  hideHeader?: boolean;
  /** @private This is internal usage. Do not use in your production env */
  onPickerValueChange?: (date: DateType) => void;

  /** @private Internal usage. Do not use in your production env */
  components?: Components;
};

export type PickerPanelBaseProps<DateType> = {
  picker: Exclude<PickerMode, 'date' | 'time'>;
} & PickerPanelSharedProps<DateType>;

export type PickerPanelDateProps<DateType> = {
  picker?: 'date';
  showToday?: boolean;
  showNow?: boolean;

  // Time
  showTime?: boolean | SharedTimeProps<DateType>;
  disabledTime?: DisabledTime<DateType>;
} & PickerPanelSharedProps<DateType>;

export type PickerPanelTimeProps<DateType> = {
  picker: 'time';
} & PickerPanelSharedProps<DateType> &
  SharedTimeProps<DateType>;

export type PickerPanelProps<DateType> =
  | PickerPanelBaseProps<DateType>
  | PickerPanelDateProps<DateType>
  | PickerPanelTimeProps<DateType>;

// TMP type to fit for ts 3.9.2
type OmitType<DateType> = Omit<PickerPanelBaseProps<DateType>, 'picker'> &
  Omit<PickerPanelDateProps<DateType>, 'picker'> &
  Omit<PickerPanelTimeProps<DateType>, 'picker'>;
type MergedPickerPanelProps<DateType> = {
  picker?: PickerMode;
} & OmitType<DateType>;

function PickerPanel<DateType>() {
  return defineComponent<MergedPickerPanelProps<DateType>>({
    name: 'PickerPanel',
    inheritAttrs: false,
    props: {
      prefixCls: String,
      locale: Object,
      generateConfig: Object,
      value: Object,
      defaultValue: Object,
      pickerValue: Object,
      defaultPickerValue: Object,
      disabledDate: Function,
      mode: String,
      picker: { type: String, default: 'date' },
      tabindex: { type: [Number, String], default: 0 },
      showNow: { type: Boolean, default: undefined },
      showTime: [Boolean, Object],
      showToday: Boolean,
      renderExtraFooter: Function,
      dateRender: Function,
      hideHeader: { type: Boolean, default: undefined },
      onSelect: Function,
      onChange: Function,
      onPanelChange: Function,
      onMousedown: Function,
      onPickerValueChange: Function,
      onOk: Function,
      components: Object,
      direction: String,
      hourStep: { type: Number, default: 1 },
      minuteStep: { type: Number, default: 1 },
      secondStep: { type: Number, default: 1 },
    } as any,
    setup(props, { attrs }) {
      const needConfirmButton = computed(
        () => (props.picker === 'date' && !!props.showTime) || props.picker === 'time',
      );

      const isHourStepValid = computed(() => 24 % props.hourStep === 0);
      const isMinuteStepValid = computed(() => 60 % props.minuteStep === 0);
      const isSecondStepValid = computed(() => 60 % props.secondStep === 0);
      if (process.env.NODE_ENV !== 'production') {
        watchEffect(() => {
          const { generateConfig, value, hourStep = 1, minuteStep = 1, secondStep = 1 } = props;
          warning(!value || generateConfig.isValidate(value), 'Invalidate date pass to `value`.');
          warning(
            !value || generateConfig.isValidate(value),
            'Invalidate date pass to `defaultValue`.',
          );
          warning(
            isHourStepValid.value,
            `\`hourStep\` ${hourStep} is invalid. It should be a factor of 24.`,
          );
          warning(
            isMinuteStepValid.value,
            `\`minuteStep\` ${minuteStep} is invalid. It should be a factor of 60.`,
          );
          warning(
            isSecondStepValid.value,
            `\`secondStep\` ${secondStep} is invalid. It should be a factor of 60.`,
          );
        });
      }

      const panelContext = useInjectPanel();
      const {
        operationRef,
        onSelect: onContextSelect,
        hideRanges,
        defaultOpenValue,
      } = panelContext;
      const { inRange, panelPosition, rangedValue, hoverRangedValue } = useInjectRange();
      const panelRef = ref<PanelRefProps>({});
      // Value
      const [mergedValue, setInnerValue] = useMergedState<DateType | null>(null, {
        value: toRef(props, 'value'),
        defaultValue: props.defaultValue,
        postState: val => {
          if (!val && defaultOpenValue?.value && props.picker === 'time') {
            return defaultOpenValue.value;
          }
          return val;
        },
      });

      // View date control
      const [viewDate, setInnerViewDate] = useMergedState<DateType | null>(null, {
        value: toRef(props, 'pickerValue'),
        defaultValue: props.defaultPickerValue || mergedValue.value,
        postState: date => {
          const { generateConfig, showTime, defaultValue } = props;
          const now = generateConfig.getNow();
          if (!date) return now;
          // When value is null and set showTime
          if (!mergedValue.value && props.showTime) {
            if (typeof showTime === 'object') {
              return setDateTime(
                generateConfig,
                Array.isArray(date) ? date[0] : date,
                showTime.defaultValue || now,
              );
            }
            if (defaultValue) {
              return setDateTime(
                generateConfig,
                Array.isArray(date) ? date[0] : date,
                defaultValue,
              );
            }
            return setDateTime(generateConfig, Array.isArray(date) ? date[0] : date, now);
          }
          return date;
        },
      });

      const setViewDate = (date: DateType) => {
        setInnerViewDate(date);
        if (props.onPickerValueChange) {
          props.onPickerValueChange(date);
        }
      };

      // Panel control
      const getInternalNextMode = (nextMode: PanelMode): PanelMode => {
        const getNextMode = PickerModeMap[props.picker!];
        if (getNextMode) {
          return getNextMode(nextMode);
        }

        return nextMode;
      };

      // Save panel is changed from which panel
      const [mergedMode, setInnerMode] = useMergedState(
        () => {
          if (props.picker === 'time') {
            return 'time';
          }
          return getInternalNextMode('date');
        },
        {
          value: toRef(props, 'mode'),
        },
      );
      watch(
        () => props.picker,
        () => {
          setInnerMode(props.picker);
        },
      );

      const sourceMode = ref(mergedMode.value);
      const setSourceMode = (val: PanelMode) => {
        sourceMode.value = val;
      };

      const onInternalPanelChange = (newMode: PanelMode | null, viewValue: DateType) => {
        const { onPanelChange, generateConfig } = props;
        const nextMode = getInternalNextMode(newMode || mergedMode.value);
        setSourceMode(mergedMode.value);
        setInnerMode(nextMode);

        if (
          onPanelChange &&
          (mergedMode.value !== nextMode || isEqual(generateConfig, viewDate.value, viewDate.value))
        ) {
          onPanelChange(viewValue, nextMode);
        }
      };

      const triggerSelect = (
        date: DateType,
        type: 'key' | 'mouse' | 'submit',
        forceTriggerSelect = false,
      ) => {
        const { picker, generateConfig, onSelect, onChange, disabledDate } = props;
        if (mergedMode.value === picker || forceTriggerSelect) {
          setInnerValue(date);

          if (onSelect) {
            onSelect(date);
          }

          if (onContextSelect) {
            onContextSelect(date, type);
          }

          if (
            onChange &&
            !isEqual(generateConfig, date, mergedValue.value) &&
            !disabledDate?.(date)
          ) {
            onChange(date);
          }
        }
      };

      // ========================= Interactive ==========================
      const onInternalKeydown = (e: KeyboardEvent) => {
        if (panelRef.value && panelRef.value.onKeydown) {
          if (
            [
              KeyCode.LEFT,
              KeyCode.RIGHT,
              KeyCode.UP,
              KeyCode.DOWN,
              KeyCode.PAGE_UP,
              KeyCode.PAGE_DOWN,
              KeyCode.ENTER,
            ].includes(e.which)
          ) {
            e.preventDefault();
          }
          return panelRef.value.onKeydown(e);
        }

        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          warning(
            false,
            'Panel not correct handle keyDown event. Please help to fire issue about this.',
          );
          return false;
        }
        /* eslint-enable no-lone-blocks */
      };

      const onInternalBlur = (e: FocusEvent) => {
        if (panelRef.value && panelRef.value.onBlur) {
          panelRef.value.onBlur(e);
        }
      };
      const onNow = () => {
        const { generateConfig, hourStep, minuteStep, secondStep } = props;
        const now = generateConfig.getNow();
        const lowerBoundTime = getLowerBoundTime(
          generateConfig.getHour(now),
          generateConfig.getMinute(now),
          generateConfig.getSecond(now),
          isHourStepValid.value ? hourStep : 1,
          isMinuteStepValid.value ? minuteStep : 1,
          isSecondStepValid.value ? secondStep : 1,
        );
        const adjustedNow = setTime(
          generateConfig,
          now,
          lowerBoundTime[0], // hour
          lowerBoundTime[1], // minute
          lowerBoundTime[2], // second
        );
        triggerSelect(adjustedNow, 'submit');
      };

      const classString = computed(() => {
        const { prefixCls, direction } = props;
        return classNames(`${prefixCls}-panel`, {
          [`${prefixCls}-panel-has-range`]:
            rangedValue && rangedValue.value && rangedValue.value[0] && rangedValue.value[1],
          [`${prefixCls}-panel-has-range-hover`]:
            hoverRangedValue &&
            hoverRangedValue.value &&
            hoverRangedValue.value[0] &&
            hoverRangedValue.value[1],
          [`${prefixCls}-panel-rtl`]: direction === 'rtl',
        });
      });
      useProvidePanel({
        ...panelContext,
        mode: mergedMode,
        hideHeader: computed(() =>
          props.hideHeader !== undefined ? props.hideHeader : panelContext.hideHeader?.value,
        ),
        hidePrevBtn: computed(() => inRange.value && panelPosition.value === 'right'),
        hideNextBtn: computed(() => inRange.value && panelPosition.value === 'left'),
      });

      watch(
        () => props.value,
        () => {
          if (props.value) {
            setInnerViewDate(props.value);
          }
        },
      );

      return () => {
        const {
          prefixCls = 'ant-picker',
          locale,
          generateConfig,
          disabledDate,
          picker = 'date',
          tabindex = 0,
          showNow,
          showTime,
          showToday,
          renderExtraFooter,
          onMousedown,
          onOk,
          components,
        } = props;
        if (operationRef && panelPosition.value !== 'right') {
          operationRef.value = {
            onKeydown: onInternalKeydown,
            onClose: () => {
              if (panelRef.value && panelRef.value.onClose) {
                panelRef.value.onClose();
              }
            },
          };
        }

        // ============================ Panels ============================
        let panelNode: VueNode;
        const pickerProps = {
          ...attrs,
          ...(props as MergedPickerPanelProps<DateType>),
          operationRef: panelRef,
          prefixCls,
          viewDate: viewDate.value,
          value: mergedValue.value,
          onViewDateChange: setViewDate,
          sourceMode: sourceMode.value,
          onPanelChange: onInternalPanelChange,
          disabledDate,
        };
        delete pickerProps.onChange;
        delete pickerProps.onSelect;
        switch (mergedMode.value) {
          case 'decade':
            panelNode = (
              <DecadePanel<DateType>
                {...pickerProps}
                onSelect={(date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }}
              />
            );
            break;

          case 'year':
            panelNode = (
              <YearPanel<DateType>
                {...pickerProps}
                onSelect={(date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }}
              />
            );
            break;

          case 'month':
            panelNode = (
              <MonthPanel<DateType>
                {...pickerProps}
                onSelect={(date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }}
              />
            );
            break;

          case 'quarter':
            panelNode = (
              <QuarterPanel<DateType>
                {...pickerProps}
                onSelect={(date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }}
              />
            );
            break;

          case 'week':
            panelNode = (
              <WeekPanel
                {...pickerProps}
                onSelect={(date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }}
              />
            );
            break;

          case 'time':
            delete pickerProps.showTime;
            panelNode = (
              <TimePanel<DateType>
                {...pickerProps}
                {...(typeof showTime === 'object' ? showTime : null)}
                onSelect={(date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }}
              />
            );
            break;

          default:
            if (showTime) {
              panelNode = (
                <DatetimePanel
                  {...pickerProps}
                  onSelect={(date, type) => {
                    setViewDate(date);
                    triggerSelect(date, type);
                  }}
                />
              );
            } else {
              panelNode = (
                <DatePanel<DateType>
                  {...pickerProps}
                  onSelect={(date, type) => {
                    setViewDate(date);
                    triggerSelect(date, type);
                  }}
                />
              );
            }
        }

        // ============================ Footer ============================
        let extraFooter: VueNode;
        let rangesNode: VueNode;

        if (!hideRanges?.value) {
          extraFooter = getExtraFooter(prefixCls, mergedMode.value, renderExtraFooter);
          rangesNode = getRanges({
            prefixCls,
            components,
            needConfirmButton: needConfirmButton.value,
            okDisabled: !mergedValue.value || (disabledDate && disabledDate(mergedValue.value)),
            locale,
            showNow,
            onNow: needConfirmButton.value && onNow,
            onOk: () => {
              if (mergedValue.value) {
                triggerSelect(mergedValue.value, 'submit', true);
                if (onOk) {
                  onOk(mergedValue.value);
                }
              }
            },
          });
        }

        let todayNode: VueNode;

        if (showToday && mergedMode.value === 'date' && picker === 'date' && !showTime) {
          const now = generateConfig.getNow();
          const todayCls = `${prefixCls}-today-btn`;
          const disabled = disabledDate && disabledDate(now);
          todayNode = (
            <a
              class={classNames(todayCls, disabled && `${todayCls}-disabled`)}
              aria-disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  triggerSelect(now, 'mouse', true);
                }
              }}
            >
              {locale.today}
            </a>
          );
        }
        return (
          <div
            tabindex={tabindex}
            class={classNames(classString.value, attrs.class)}
            style={attrs.style as CSSProperties}
            onKeydown={onInternalKeydown}
            onBlur={onInternalBlur}
            onMousedown={onMousedown}
          >
            {panelNode}
            {extraFooter || rangesNode || todayNode ? (
              <div class={`${prefixCls}-footer`}>
                {extraFooter}
                {rangesNode}
                {todayNode}
              </div>
            ) : null}
          </div>
        );
      };
    },
  });
}
const InterPickerPanel = PickerPanel<any>();
export default <DateType,>(props: MergedPickerPanelProps<DateType>) =>
  createVNode(InterPickerPanel, props);
