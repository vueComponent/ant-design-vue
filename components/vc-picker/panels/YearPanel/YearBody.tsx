
import type { GenerateConfig } from '../../generate';
import { YEAR_DECADE_COUNT } from '.';
import type { Locale, NullableDateType } from '../../interface';
import useCellClassName from '../../hooks/useCellClassName';
import { formatValue, isSameYear } from '../../utils/dateUtil';
import RangeContext, { useInjectRange } from '../../RangeContext';
import PanelBody from '../PanelBody';

export const YEAR_COL_COUNT = 3;
const YEAR_ROW_COUNT = 4;

export type YearBodyProps<DateType> = {
  prefixCls: string;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;
  value?: NullableDateType<DateType>;
  viewDate: DateType;
  disabledDate?: (date: DateType) => boolean;
  onSelect: (value: DateType) => void;
};

function YearBody<DateType>(props: YearBodyProps<DateType>) {
  const { prefixCls, value, viewDate, locale, generateConfig } = props;
  const { rangedValue, hoverRangedValue } = useInjectRange()

  const yearPrefixCls = `${prefixCls}-cell`;

  // =============================== Year ===============================
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / YEAR_DECADE_COUNT) * YEAR_DECADE_COUNT;
  const endYear = startYear + YEAR_DECADE_COUNT - 1;
  const baseYear = generateConfig.setYear(
    viewDate,
    startYear - Math.ceil((YEAR_COL_COUNT * YEAR_ROW_COUNT - YEAR_DECADE_COUNT) / 2),
  );

  const isInView = (date: DateType) => {
    const currentYearNumber = generateConfig.getYear(date);
    return startYear <= currentYearNumber && currentYearNumber <= endYear;
  };

  const getCellClassName = useCellClassName<DateType>({
    cellPrefixCls: yearPrefixCls,
    value,
    generateConfig,
    rangedValue,
    hoverRangedValue,
    isSameCell: (current, target) => isSameYear(generateConfig, current, target),
    isInView,
    offsetCell: (date, offset) => generateConfig.addYear(date, offset),
  });

  return (
    <PanelBody
      {...props}
      rowNum={YEAR_ROW_COUNT}
      colNum={YEAR_COL_COUNT}
      baseDate={baseYear}
      getCellText={generateConfig.getYear}
      getCellClassName={getCellClassName}
      getCellDate={generateConfig.addYear}
      titleCell={date =>
        formatValue(date, {
          locale,
          format: 'YYYY',
          generateConfig,
        })
      }
    />
  );
}



YearBody.displayName = 'YearBody';
YearBody.inheritAttrs = false;

export default YearBody;
