import { defineComponent, onMounted, ref } from 'vue';
import VCResizeObserver from '../../vc-resize-observer';
import type { Key } from '../interface';

export interface MeasureCellProps {
  columnKey: Key;
  onColumnResize: (key: Key, width: number) => void;
}

export default defineComponent<MeasureCellProps>({
  name: 'MeasureCell',
  props: ['columnKey'] as any,
  setup(props, { emit }) {
    const tdRef = ref<HTMLTableCellElement>();
    onMounted(() => {
      if (tdRef.value) {
        emit('columnResize', props.columnKey, tdRef.value.offsetWidth);
      }
    });
    return () => {
      return (
        <VCResizeObserver
          onResize={({ offsetWidth }) => {
            emit('columnResize', props.columnKey, offsetWidth);
          }}
        >
          <td ref={tdRef} style={{ padding: 0, border: 0, height: 0 }}>
            <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
          </td>
        </VCResizeObserver>
      );
    };
  },
});
