import Header from '../Header';
import type { GenerateConfig } from '../../generate';
import { YEAR_DECADE_COUNT } from '.';
import { useInjectPanel } from '../../PanelContext';
import useMergeProps from '../../hooks/useMergeProps';

export type YearHeaderProps<DateType> = {
  prefixCls: string;
  viewDate: DateType;
  value?: DateType | null;
  generateConfig: GenerateConfig<DateType>;

  onPrevDecade: () => void;
  onNextDecade: () => void;
  onDecadeClick: () => void;
};

function YearHeader<DateType>(_props: YearHeaderProps<DateType>) {
  const props = useMergeProps(_props);
  const { prefixCls, generateConfig, viewDate, onPrevDecade, onNextDecade, onDecadeClick } = props;
  const { hideHeader } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }

  const headerPrefixCls = `${prefixCls}-header`;

  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / YEAR_DECADE_COUNT) * YEAR_DECADE_COUNT;
  const endYear = startYear + YEAR_DECADE_COUNT - 1;

  return (
    <Header
      {...props}
      prefixCls={headerPrefixCls}
      onSuperPrev={onPrevDecade}
      onSuperNext={onNextDecade}
    >
      <button type="button" onClick={onDecadeClick} class={`${prefixCls}-decade-btn`}>
        {startYear}-{endYear}
      </button>
    </Header>
  );
}

YearHeader.displayName = 'YearHeader';
YearHeader.inheritAttrs = false;

export default YearHeader;
