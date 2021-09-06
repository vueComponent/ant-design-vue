import VCResizeObserver from '../../vc-resize-observer';
import type { Key } from '../interface';

export interface MeasureCellProps {
  columnKey: Key;
  onColumnResize: (key: Key, width: number) => void;
}

export default function MeasureCell({ columnKey }: MeasureCellProps, { emit }) {
  return (
    <VCResizeObserver
      onResize={({ offsetWidth }) => {
        emit('columnResize', columnKey, offsetWidth);
      }}
    >
      <td style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
      </td>
    </VCResizeObserver>
  );
}
