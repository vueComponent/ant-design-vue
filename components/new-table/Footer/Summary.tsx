import { FunctionalComponent } from 'vue';
import Cell from './Cell';
import Row from './Row';

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom';
}

export interface SummaryFC extends FunctionalComponent<SummaryProps> {
  Row: typeof Row;
  Cell: typeof Cell;
}

/**
 * Syntactic sugar. Do not support HOC.
 */
const Summary: SummaryFC = (_props, { slots }) => {
  return slots.default?.();
};

Summary.Row = Row;
Summary.Cell = Cell;

Summary.displayName = 'Summary';

export default Summary;
