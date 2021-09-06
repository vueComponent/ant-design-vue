import Table from './Table';
import type Column from './Column';
import type ColumnGroup from './ColumnGroup';
import type { TableProps, TablePaginationConfig } from './Table';
import type { App } from 'vue';

export type { ColumnProps } from './Column';
export type { ColumnsType, ColumnType, ColumnGroupType } from './interface';
export type { TableProps, TablePaginationConfig };

/* istanbul ignore next */
Table.install = function (app: App) {
  app.component(Table.name, Table);
  app.component(Table.Column.name, Table.Column);
  app.component(Table.ColumnGroup.name, Table.ColumnGroup);
  return app;
};

export const TableColumn = Table.Column;
export const TableColumnGroup = Table.ColumnGroup;

export default Table as typeof Table &
  Plugin & {
    readonly Column: typeof Column;
    readonly ColumnGroup: typeof ColumnGroup;
  };
