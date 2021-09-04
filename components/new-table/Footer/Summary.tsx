import { computed, defineComponent, onBeforeUnmount, watchEffect } from 'vue';
import { useInjectTable } from '../context/TableContext';
import Cell from './Cell';
import Row from './Row';

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom';
}

let indexGuid = 0;
const Summary = defineComponent<SummaryProps>({
  props: ['fixed'] as any,
  name: 'Summary',
  Row,
  Cell,
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
