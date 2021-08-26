import Header from '../Header';
import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
import { useInjectPanel } from '../../PanelContext';
import { formatValue } from '../../utils/dateUtil';
import useMergeProps from '../../hooks/useMergeProps';

export type MonthHeaderProps<DateType> = {
  prefixCls: string;
  viewDate: DateType;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;

  onPrevYear: () => void;
  onNextYear: () => void;
  onYearClick: () => void;
};

function MonthHeader<DateType>(_props: MonthHeaderProps<DateType>) {
  const props = useMergeProps(_props);
  const { prefixCls, generateConfig, locale, viewDate, onNextYear, onPrevYear, onYearClick } =
    props;
  const { hideHeader } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }

  const headerPrefixCls = `${prefixCls}-header`;

  return (
    <Header
      {...props}
      prefixCls={headerPrefixCls}
      onSuperPrev={onPrevYear}
      onSuperNext={onNextYear}
    >
      <button type="button" onClick={onYearClick} class={`${prefixCls}-year-btn`}>
        {formatValue(viewDate, {
          locale,
          format: locale.yearFormat,
          generateConfig,
        })}
      </button>
    </Header>
  );
}

MonthHeader.displayName = 'MonthHeader';
MonthHeader.inheritAttrs = false;

export default MonthHeader;
