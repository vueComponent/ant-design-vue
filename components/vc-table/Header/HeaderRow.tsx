import { defineComponent } from 'vue';
import Cell from '../Cell';
import { useInjectTable } from '../context/TableContext';
import type {
  CellType,
  StickyOffsets,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
  DefaultRecordType,
} from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';
import { getColumnsKey } from '../utils/valueUtil';
import DragHandleVue from './DragHandle';

export interface RowProps<RecordType = DefaultRecordType> {
  cells: readonly CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  customHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
  index: number;
}

export default defineComponent<RowProps>({
  name: 'HeaderRow',
  props: [
    'cells',
    'stickyOffsets',
    'flattenColumns',
    'rowComponent',
    'cellComponent',
    'index',
    'customHeaderRow',
  ] as any,
  setup(props: RowProps) {
    const tableContext = useInjectTable();
    return () => {
      const { prefixCls, direction } = tableContext;
      const {
        cells,
        stickyOffsets,
        flattenColumns,
        rowComponent: RowComponent,
        cellComponent: CellComponent,
        customHeaderRow,
        index,
      } = props;

      let rowProps;
      if (customHeaderRow) {
        rowProps = customHeaderRow(
          cells.map(cell => cell.column),
          index,
        );
      }

      const columnsKey = getColumnsKey(cells.map(cell => cell.column));

      return (
        <RowComponent {...rowProps}>
          {cells.map((cell: CellType, cellIndex) => {
            const { column } = cell;
            const fixedInfo = getCellFixedInfo(
              cell.colStart,
              cell.colEnd,
              flattenColumns,
              stickyOffsets,
              direction,
            );

            let additionalProps;
            if (column && column.customHeaderCell) {
              additionalProps = cell.column.customHeaderCell(column);
            }
            const col: ColumnType<any> = column;
            return (
              <Cell
                {...cell}
                cellType="header"
                ellipsis={column.ellipsis}
                align={column.align}
                component={CellComponent}
                prefixCls={prefixCls}
                key={columnsKey[cellIndex]}
                {...fixedInfo}
                additionalProps={additionalProps}
                rowType="header"
                column={column}
                v-slots={{
                  default: () => column.title,
                  dragHandle: () =>
                    col.resizable ? (
                      <DragHandleVue
                        prefixCls={prefixCls}
                        width={col.width as number}
                        minWidth={col.minWidth}
                        maxWidth={col.maxWidth}
                        column={col}
                      />
                    ) : null,
                }}
              />
            );
          })}
        </RowComponent>
      );
    };
  },
});
