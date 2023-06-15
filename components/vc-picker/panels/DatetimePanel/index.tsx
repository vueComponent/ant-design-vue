import type { DatePanelProps } from '../DatePanel';
import DatePanel from '../DatePanel';
import type { SharedTimeProps } from '../TimePanel';
import TimePanel from '../TimePanel';
import { tuple } from '../../utils/miscUtil';
import { setDateTime as setTime } from '../../utils/timeUtil';
import type { PanelRefProps, DisabledTime } from '../../interface';
import KeyCode from '../../../_util/KeyCode';
import classNames from '../../../_util/classNames';
import { ref } from 'vue';
import useMergeProps from '../../hooks/useMergeProps';

export type DatetimePanelProps<DateType> = {
  disabledTime?: DisabledTime<DateType>;
  showTime?: boolean | SharedTimeProps<DateType>;
  defaultValue?: DateType;
} & Omit<DatePanelProps<DateType>, 'disabledHours' | 'disabledMinutes' | 'disabledSeconds'>;

const ACTIVE_PANEL = tuple('date', 'time');
type ActivePanelType = (typeof ACTIVE_PANEL)[number];

function DatetimePanel<DateType>(_props: DatetimePanelProps<DateType>) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    operationRef,
    generateConfig,
    value,
    defaultValue,
    disabledTime,
    showTime,
    onSelect,
  } = props;
  const panelPrefixCls = `${prefixCls}-datetime-panel`;
  const activePanel = ref<ActivePanelType | null>(null);

  const dateOperationRef = ref<PanelRefProps>({});
  const timeOperationRef = ref<PanelRefProps>({});

  const timeProps = typeof showTime === 'object' ? { ...showTime } : {};

  // ======================= Keyboard =======================
  function getNextActive(offset: number) {
    const activeIndex = ACTIVE_PANEL.indexOf(activePanel.value!) + offset;
    const nextActivePanel = ACTIVE_PANEL[activeIndex] || null;
    return nextActivePanel;
  }

  const onBlur = (e?: FocusEvent) => {
    if (timeOperationRef.value.onBlur) {
      timeOperationRef.value.onBlur(e!);
    }
    activePanel.value = null;
  };

  operationRef.value = {
    onKeydown: (event: KeyboardEvent) => {
      // Switch active panel
      if (event.which === KeyCode.TAB) {
        const nextActivePanel = getNextActive(event.shiftKey ? -1 : 1);
        activePanel.value = nextActivePanel;

        if (nextActivePanel) {
          event.preventDefault();
        }

        return true;
      }

      // Operate on current active panel
      if (activePanel.value) {
        const ref = activePanel.value === 'date' ? dateOperationRef : timeOperationRef;

        if (ref.value && ref.value.onKeydown) {
          ref.value.onKeydown(event);
        }

        return true;
      }

      // Switch first active panel if operate without panel
      if ([KeyCode.LEFT, KeyCode.RIGHT, KeyCode.UP, KeyCode.DOWN].includes(event.which)) {
        activePanel.value = 'date';
        return true;
      }

      return false;
    },
    onBlur,
    onClose: onBlur,
  };

  // ======================== Events ========================
  const onInternalSelect = (date: DateType, source: 'date' | 'time') => {
    let selectedDate = date;

    if (source === 'date' && !value && timeProps.defaultValue) {
      // Date with time defaultValue
      selectedDate = generateConfig.setHour(
        selectedDate,
        generateConfig.getHour(timeProps.defaultValue),
      );
      selectedDate = generateConfig.setMinute(
        selectedDate,
        generateConfig.getMinute(timeProps.defaultValue),
      );
      selectedDate = generateConfig.setSecond(
        selectedDate,
        generateConfig.getSecond(timeProps.defaultValue),
      );
    } else if (source === 'time' && !value && defaultValue) {
      selectedDate = generateConfig.setYear(selectedDate, generateConfig.getYear(defaultValue));
      selectedDate = generateConfig.setMonth(selectedDate, generateConfig.getMonth(defaultValue));
      selectedDate = generateConfig.setDate(selectedDate, generateConfig.getDate(defaultValue));
    }

    if (onSelect) {
      onSelect(selectedDate, 'mouse');
    }
  };

  // ======================== Render ========================
  const disabledTimes = disabledTime ? disabledTime(value || null) : {};

  return (
    <div
      class={classNames(panelPrefixCls, {
        [`${panelPrefixCls}-active`]: activePanel.value,
      })}
    >
      <DatePanel
        {...props}
        operationRef={dateOperationRef}
        active={activePanel.value === 'date'}
        onSelect={date => {
          onInternalSelect(
            setTime(
              generateConfig,
              date,
              !value && typeof showTime === 'object' ? showTime.defaultValue : null,
            ),
            'date',
          );
        }}
      />
      <TimePanel
        {...props}
        format={undefined}
        {...timeProps}
        {...disabledTimes}
        disabledTime={null}
        defaultValue={undefined}
        operationRef={timeOperationRef}
        active={activePanel.value === 'time'}
        onSelect={date => {
          onInternalSelect(date, 'time');
        }}
      />
    </div>
  );
}

DatetimePanel.displayName = 'DatetimePanel';
DatetimePanel.inheritAttrs = false;

export default DatetimePanel;
