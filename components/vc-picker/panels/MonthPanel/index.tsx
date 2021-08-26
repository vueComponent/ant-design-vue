import MonthHeader from './MonthHeader';
import type { MonthCellRender } from './MonthBody';
import MonthBody, { MONTH_COL_COUNT } from './MonthBody';
import type { PanelSharedProps } from '../../interface';
import { createKeydownHandler } from '../../utils/uiUtil';
import useMergeProps from '../../hooks/useMergeProps';

export type MonthPanelProps<DateType> = {
  monthCellContentRender?: MonthCellRender<DateType>;
} & PanelSharedProps<DateType>;

function MonthPanel<DateType>(_props: MonthPanelProps<DateType>) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    operationRef,
    onViewDateChange,
    generateConfig,
    value,
    viewDate,
    onPanelChange,
    onSelect,
  } = props;

  const panelPrefixCls = `${prefixCls}-month-panel`;

  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: (event: KeyboardEvent) =>
      createKeydownHandler(event, {
        onLeftRight: diff => {
          onSelect(generateConfig.addMonth(value || viewDate, diff), 'key');
        },
        onCtrlLeftRight: diff => {
          onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
        },
        onUpDown: diff => {
          onSelect(generateConfig.addMonth(value || viewDate, diff * MONTH_COL_COUNT), 'key');
        },
        onEnter: () => {
          onPanelChange('date', value || viewDate);
        },
      }),
  };

  // ==================== View Operation ====================
  const onYearChange = (diff: number) => {
    const newDate = generateConfig.addYear(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };

  return (
    <div class={panelPrefixCls}>
      <MonthHeader
        {...props}
        prefixCls={prefixCls}
        onPrevYear={() => {
          onYearChange(-1);
        }}
        onNextYear={() => {
          onYearChange(1);
        }}
        onYearClick={() => {
          onPanelChange('year', viewDate);
        }}
      />
      <MonthBody<DateType>
        {...props}
        prefixCls={prefixCls}
        onSelect={date => {
          onSelect(date, 'mouse');
          onPanelChange('date', date);
        }}
      />
    </div>
  );
}

MonthPanel.displayName = 'MonthPanel';
MonthPanel.inheritAttrs = false;

export default MonthPanel;
