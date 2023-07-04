import TimeHeader from './TimeHeader';
import type { BodyOperationRef } from './TimeBody';
import TimeBody from './TimeBody';
import type { PanelSharedProps, DisabledTimes } from '../../interface';
import { createKeydownHandler } from '../../utils/uiUtil';
import classNames from '../../../_util/classNames';
import { ref } from 'vue';
import useMergeProps from '../../hooks/useMergeProps';
// import type { RangeType } from '../../RangePicker';

export type SharedTimeProps<DateType> = {
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
  defaultValue?: DateType;

  /** @deprecated Please use `disabledTime` instead. */
  disabledHours?: DisabledTimes['disabledHours'];
  /** @deprecated Please use `disabledTime` instead. */
  disabledMinutes?: DisabledTimes['disabledMinutes'];
  /** @deprecated Please use `disabledTime` instead. */
  disabledSeconds?: DisabledTimes['disabledSeconds'];

  disabledTime?: (date: DateType) => DisabledTimes;
};

export type TimePanelProps<DateType> = {
  format?: string;
  active?: boolean;
} & PanelSharedProps<DateType> &
  SharedTimeProps<DateType>;

const countBoolean = (boolList: (boolean | undefined)[]) =>
  boolList.filter(bool => bool !== false).length;

function TimePanel<DateType>(_props: TimePanelProps<DateType>) {
  const props = useMergeProps(_props);
  const {
    generateConfig,
    format = 'HH:mm:ss',
    prefixCls,
    active,
    operationRef,
    showHour,
    showMinute,
    showSecond,
    use12Hours = false,
    onSelect,
    value,
  } = props;
  const panelPrefixCls = `${prefixCls}-time-panel`;
  const bodyOperationRef = ref<BodyOperationRef>();

  // ======================= Keyboard =======================
  const activeColumnIndex = ref(-1);
  const columnsCount = countBoolean([showHour, showMinute, showSecond, use12Hours]);

  operationRef.value = {
    onKeydown: (event: KeyboardEvent) =>
      createKeydownHandler(event, {
        onLeftRight: diff => {
          activeColumnIndex.value = (activeColumnIndex.value + diff + columnsCount) % columnsCount;
        },
        onUpDown: diff => {
          if (activeColumnIndex.value === -1) {
            activeColumnIndex.value = 0;
          } else if (bodyOperationRef.value) {
            bodyOperationRef.value.onUpDown(diff);
          }
        },
        onEnter: () => {
          onSelect(value || generateConfig.getNow(), 'key');
          activeColumnIndex.value = -1;
        },
      }),

    onBlur: () => {
      activeColumnIndex.value = -1;
    },
  };

  return (
    <div
      class={classNames(panelPrefixCls, {
        [`${panelPrefixCls}-active`]: active,
      })}
    >
      <TimeHeader {...props} format={format} prefixCls={prefixCls} />
      <TimeBody
        {...props}
        prefixCls={prefixCls}
        activeColumnIndex={activeColumnIndex.value}
        operationRef={bodyOperationRef}
      />
    </div>
  );
}

TimePanel.displayName = 'TimePanel';
TimePanel.inheritAttrs = false;

export default TimePanel;
