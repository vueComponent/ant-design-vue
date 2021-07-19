import DatePanel from '../DatePanel';
import type { PanelSharedProps } from '../../interface';
import { isSameWeek } from '../../utils/dateUtil';
import classNames from '../../../_util/classNames';
import useMergeProps from '../../hooks/useMergeProps';

export type WeekPanelProps<DateType> = PanelSharedProps<DateType>;

function WeekPanel<DateType>(_props: WeekPanelProps<DateType>) {
  const props = useMergeProps(_props);
  const { prefixCls, generateConfig, locale, value } = props;

  // Render additional column
  const cellPrefixCls = `${prefixCls}-cell`;
  const prefixColumn = (date: DateType) => (
    <td key="week" class={classNames(cellPrefixCls, `${cellPrefixCls}-week`)}>
      {generateConfig.locale.getWeek(locale.locale, date)}
    </td>
  );

  // Add row className
  const rowPrefixCls = `${prefixCls}-week-panel-row`;
  const rowClassName = (date: DateType) =>
    classNames(rowPrefixCls, {
      [`${rowPrefixCls}-selected`]: isSameWeek(generateConfig, locale.locale, value, date),
    });

  return (
    <DatePanel
      {...props}
      panelName="week"
      prefixColumn={prefixColumn}
      rowClassName={rowClassName}
      keyboardConfig={{
        onLeftRight: null,
      }}
    />
  );
}

WeekPanel.displayName = 'WeekPanel';
WeekPanel.inheritAttrs = false;

export default WeekPanel;
