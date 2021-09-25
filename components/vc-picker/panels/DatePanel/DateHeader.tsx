import Header from '../Header';
import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
import { useInjectPanel } from '../../PanelContext';
import { formatValue } from '../../utils/dateUtil';
import type { VueNode } from '../../../_util/type';
import useMergeProps from '../../hooks/useMergeProps';

export type DateHeaderProps<DateType> = {
  prefixCls: string;
  viewDate: DateType;
  value?: DateType | null;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;

  onPrevYear: () => void;
  onNextYear: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearClick: () => void;
  onMonthClick: () => void;
};

function DateHeader<DateType>(_props: DateHeaderProps<DateType>) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    viewDate,
    onNextMonth,
    onPrevMonth,
    onNextYear,
    onPrevYear,
    onYearClick,
    onMonthClick,
  } = props;

  const { hideHeader } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }

  const headerPrefixCls = `${prefixCls}-header`;

  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  const month = generateConfig.getMonth(viewDate);

  // =================== Month & Year ===================
  const yearNode: VueNode = (
    <button
      type="button"
      key="year"
      onClick={onYearClick}
      tabindex={-1}
      class={`${prefixCls}-year-btn`}
    >
      {formatValue(viewDate, {
        locale,
        format: locale.yearFormat,
        generateConfig,
      })}
    </button>
  );
  const monthNode: VueNode = (
    <button
      type="button"
      key="month"
      onClick={onMonthClick}
      tabindex={-1}
      class={`${prefixCls}-month-btn`}
    >
      {locale.monthFormat
        ? formatValue(viewDate, {
            locale,
            format: locale.monthFormat,
            generateConfig,
          })
        : monthsLocale[month]}
    </button>
  );

  const monthYearNodes = locale.monthBeforeYear ? [monthNode, yearNode] : [yearNode, monthNode];

  return (
    <Header
      {...props}
      prefixCls={headerPrefixCls}
      onSuperPrev={onPrevYear}
      onPrev={onPrevMonth}
      onNext={onNextMonth}
      onSuperNext={onNextYear}
    >
      {monthYearNodes}
    </Header>
  );
}

DateHeader.displayName = 'DateHeader';
DateHeader.inheritAttrs = false;
export default DateHeader;
