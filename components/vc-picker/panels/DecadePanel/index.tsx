import DecadeHeader from './DecadeHeader';
import DecadeBody, { DECADE_COL_COUNT } from './DecadeBody';
import type { PanelSharedProps } from '../../interface';
import { createKeydownHandler } from '../../utils/uiUtil';
import useMergeProps from '../../hooks/useMergeProps';

export type DecadePanelProps<DateType> = PanelSharedProps<DateType>;

export const DECADE_UNIT_DIFF = 10;
export const DECADE_DISTANCE_COUNT = DECADE_UNIT_DIFF * 10;

function DecadePanel<DateType>(_props: DecadePanelProps<DateType>) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    onViewDateChange,
    generateConfig,
    viewDate,
    operationRef,
    onSelect,
    onPanelChange,
  } = props;

  const panelPrefixCls = `${prefixCls}-decade-panel`;

  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: (event: KeyboardEvent) =>
      createKeydownHandler(event, {
        onLeftRight: diff => {
          onSelect(generateConfig.addYear(viewDate, diff * DECADE_UNIT_DIFF), 'key');
        },
        onCtrlLeftRight: diff => {
          onSelect(generateConfig.addYear(viewDate, diff * DECADE_DISTANCE_COUNT), 'key');
        },
        onUpDown: diff => {
          onSelect(
            generateConfig.addYear(viewDate, diff * DECADE_UNIT_DIFF * DECADE_COL_COUNT),
            'key',
          );
        },
        onEnter: () => {
          onPanelChange('year', viewDate);
        },
      }),
  };

  // ==================== View Operation ====================
  const onDecadesChange = (diff: number) => {
    const newDate = generateConfig.addYear(viewDate, diff * DECADE_DISTANCE_COUNT);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };

  const onInternalSelect = (date: DateType) => {
    onSelect(date, 'mouse');
    onPanelChange('year', date);
  };

  return (
    <div class={panelPrefixCls}>
      <DecadeHeader
        {...props}
        prefixCls={prefixCls}
        onPrevDecades={() => {
          onDecadesChange(-1);
        }}
        onNextDecades={() => {
          onDecadesChange(1);
        }}
      />
      <DecadeBody {...props} prefixCls={prefixCls} onSelect={onInternalSelect} />
    </div>
  );
}

DecadePanel.displayName = 'DecadePanel';
DecadePanel.inheritAttrs = false;

export default DecadePanel;
