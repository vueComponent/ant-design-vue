import Header from '../Header';
import type { GenerateConfig } from '../../generate';
import { DECADE_DISTANCE_COUNT } from '.';
import { useInjectPanel } from '../../PanelContext';
import useMergeProps from '../../hooks/useMergeProps';

export type YearHeaderProps<DateType> = {
  prefixCls: string;
  viewDate: DateType;
  generateConfig: GenerateConfig<DateType>;

  onPrevDecades: () => void;
  onNextDecades: () => void;
};

function DecadeHeader<DateType>(_props: YearHeaderProps<DateType>) {
  const props = useMergeProps(_props);
  const { prefixCls, generateConfig, viewDate, onPrevDecades, onNextDecades } = props;
  const { hideHeader } = useInjectPanel();
  if (hideHeader) {
    return null;
  }

  const headerPrefixCls = `${prefixCls}-header`;

  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / DECADE_DISTANCE_COUNT) * DECADE_DISTANCE_COUNT;
  const endYear = startYear + DECADE_DISTANCE_COUNT - 1;

  return (
    <Header
      {...props}
      prefixCls={headerPrefixCls}
      onSuperPrev={onPrevDecades}
      onSuperNext={onNextDecades}
    >
      {startYear}-{endYear}
    </Header>
  );
}

DecadeHeader.displayName = 'DecadeHeader';
DecadeHeader.inheritAttrs = false;

export default DecadeHeader;
