import type { GenerateConfig } from '../../generate';
import type { Locale } from '../../interface';
import { formatValue, isSameMonth } from '../../utils/dateUtil';
import { useInjectRange } from '../../RangeContext';
import useCellClassName from '../../hooks/useCellClassName';
import PanelBody from '../PanelBody';
import type { VueNode } from '../../../_util/type';
import useMergeProps from '../../hooks/useMergeProps';

export const MONTH_COL_COUNT = 3;
const MONTH_ROW_COUNT = 4;

export type MonthCellRender<DateType> = (obj: { current: DateType; locale: Locale }) => VueNode;

export type MonthBodyProps<DateType> = {
  prefixCls: string;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;
  value?: DateType | null;
  viewDate: DateType;
  disabledDate?: (date: DateType) => boolean;
  monthCellRender?: MonthCellRender<DateType>;
  onSelect: (value: DateType) => void;
};

function MonthBody<DateType>(_props: MonthBodyProps<DateType>) {
  const props = useMergeProps(_props);
  const { prefixCls, locale, value, viewDate, generateConfig, monthCellRender } = props;

  const { rangedValue, hoverRangedValue } = useInjectRange();

  const cellPrefixCls = `${prefixCls}-cell`;

  const getCellClassName = useCellClassName({
    cellPrefixCls,
    value,
    generateConfig,
    rangedValue: rangedValue.value,
    hoverRangedValue: hoverRangedValue.value,
    isSameCell: (current, target) => isSameMonth(generateConfig, current, target),
    isInView: () => true,
    offsetCell: (date, offset) => generateConfig.addMonth(date, offset),
  });

  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  const baseMonth = generateConfig.setMonth(viewDate, 0);

  const getCellNode = monthCellRender
    ? (date: DateType) => monthCellRender({ current: date, locale })
    : undefined;

  return (
    <PanelBody
      {...props}
      rowNum={MONTH_ROW_COUNT}
      colNum={MONTH_COL_COUNT}
      baseDate={baseMonth}
      getCellNode={getCellNode}
      getCellText={date =>
        locale.monthFormat
          ? formatValue(date, {
              locale,
              format: locale.monthFormat,
              generateConfig,
            })
          : monthsLocale[generateConfig.getMonth(date)]
      }
      getCellClassName={getCellClassName}
      getCellDate={generateConfig.addMonth}
      titleCell={date =>
        formatValue(date, {
          locale,
          format: 'YYYY-MM',
          generateConfig,
        })
      }
    />
  );
}

MonthBody.displayName = 'MonthBody';
MonthBody.inheritAttrs = false;

export default MonthBody;
