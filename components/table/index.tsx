import Table, { tableProps } from './Table';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import type { TableProps, TablePaginationConfig } from './Table';
import { defineComponent } from 'vue';
import type { App } from 'vue';
import { Summary, SummaryCell, SummaryRow } from '../vc-table';
import { SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE } from './hooks/useSelection';

export type { ColumnProps } from './Column';
export type { ColumnsType, ColumnType, ColumnGroupType } from './interface';
export type { TableProps, TablePaginationConfig };

const TableSummaryRow = defineComponent({ ...SummaryRow, name: 'ATableSummaryRow' });
const TableSummaryCell = defineComponent({ ...SummaryCell, name: 'ATableSummaryCell' });

const TempSummary = defineComponent({
  ...Summary,
  name: 'ATableSummary',
});

const TableSummary = TempSummary as typeof TempSummary & {
  Cell: typeof TableSummaryCell;
  Row: typeof TableSummaryRow;
};
TableSummary.Cell = TableSummaryCell;
TableSummary.Row = TableSummaryRow;

const T = Table as typeof Table &
  Plugin & {
    Column: typeof Column;
    ColumnGroup: typeof ColumnGroup;
    Summary: typeof TableSummary;
    SELECTION_ALL: typeof SELECTION_ALL;
    SELECTION_INVERT: typeof SELECTION_INVERT;
    SELECTION_NONE: typeof SELECTION_NONE;
  };

T.SELECTION_ALL = SELECTION_ALL;
T.SELECTION_INVERT = SELECTION_INVERT;
T.SELECTION_NONE = SELECTION_NONE;

T.Column = Column;
T.ColumnGroup = ColumnGroup;

T.Summary = TableSummary;

/* istanbul ignore next */
T.install = function (app: App) {
  app.component(TableSummary.name, TableSummary);
  app.component(TableSummaryCell.name, TableSummaryCell);
  app.component(TableSummaryRow.name, TableSummaryRow);
  app.component(T.name, T);
  app.component(T.Column.name, Column);
  app.component(T.ColumnGroup.name, ColumnGroup);
  return app;
};

export {
  tableProps,
  TableSummary,
  TableSummaryRow,
  TableSummaryCell,
  Column as TableColumn,
  ColumnGroup as TableColumnGroup,
};

export default T;
