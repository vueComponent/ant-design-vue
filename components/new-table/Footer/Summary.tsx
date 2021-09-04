import { computed, defineComponent, FunctionalComponent, onBeforeUnmount, watchEffect } from 'vue';
import { useInjectTable } from '../context/TableContext';
import Cell from './Cell';
import Row from './Row';

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom';
}

export interface SummaryFC extends FunctionalComponent<SummaryProps> {
  Row: typeof Row;
  Cell: typeof Cell;
}

let indexGuid = 0;
const Summary = defineComponent<SummaryProps>({
  props: ['fixed'] as any,
  name: 'Summary',
  setup(props, { slots }) {
    const tableContext = useInjectTable();
    const uniKey = `table-summary-uni-key-${++indexGuid}`;
    const fixed = computed(() => (props.fixed as string) === '' || props.fixed);
    watchEffect(() => {
      tableContext.summaryCollect(uniKey, fixed.value);
    });
    onBeforeUnmount(() => {
      tableContext.summaryCollect(uniKey, false);
    });
    return () => slots.default?.();
  },
});

export default Summary;
