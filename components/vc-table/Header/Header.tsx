import classNames from '../../_util/classNames';
import { computed, defineComponent } from 'vue';
import { useInjectTable } from '../context/TableContext';
import type {
  ColumnsType,
  CellType,
  StickyOffsets,
  ColumnType,
  GetComponentProps,
  ColumnGroupType,
  DefaultRecordType,
} from '../interface';
import HeaderRow from './HeaderRow';

function parseHeaderRows<RecordType>(
  rootColumns: ColumnsType<RecordType>,
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  function fillRowCells(
    columns: ColumnsType<RecordType>,
    colIndex: number,
    rowIndex = 0,
  ): number[] {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans: number[] = columns.filter(Boolean).map(column => {
      const cell: CellType<RecordType> = {
        key: column.key,
        class: classNames(column.className, column.class),
        // children: column.title,
        column,
        colStart: currentColIndex,
      };

      let colSpan = 1;

      const subColumns = (column as ColumnGroupType<RecordType>).children;
      if (subColumns && subColumns.length > 0) {
        colSpan = fillRowCells(subColumns, currentColIndex, rowIndex + 1).reduce(
          (total, count) => total + count,
          0,
        );
        cell.hasSubColumns = true;
      }

      if ('colSpan' in column) {
        ({ colSpan } = column);
      }

      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }

      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart + colSpan - 1;
      rows[rowIndex].push(cell);

      currentColIndex += colSpan;

      return colSpan;
    });

    return colSpans;
  }

  // Generate `rows` cell data
  fillRowCells(rootColumns, 0);

  // Handle `rowSpan`
  const rowCount = rows.length;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows[rowIndex].forEach(cell => {
      if (!('rowSpan' in cell) && !cell.hasSubColumns) {
        // eslint-disable-next-line no-param-reassign
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  }

  return rows;
}

export interface HeaderProps<RecordType = DefaultRecordType> {
  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[];
  stickyOffsets: StickyOffsets;
  customHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
}

export default defineComponent<HeaderProps>({
  name: 'TableHeader',
  inheritAttrs: false,
  props: ['columns', 'flattenColumns', 'stickyOffsets', 'customHeaderRow'] as any,
  setup(props) {
    const tableContext = useInjectTable();
    const rows = computed(() => parseHeaderRows(props.columns));
    return () => {
      const { prefixCls, getComponent } = tableContext;
      const { stickyOffsets, flattenColumns, customHeaderRow } = props;
      const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
      const trComponent = getComponent(['header', 'row'], 'tr');
      const thComponent = getComponent(['header', 'cell'], 'th');
      return (
        <WrapperComponent class={`${prefixCls}-thead`}>
          {rows.value.map((row, rowIndex) => {
            const rowNode = (
              <HeaderRow
                key={rowIndex}
                flattenColumns={flattenColumns}
                cells={row}
                stickyOffsets={stickyOffsets}
                rowComponent={trComponent}
                cellComponent={thComponent}
                customHeaderRow={customHeaderRow}
                index={rowIndex}
              />
            );

            return rowNode;
          })}
        </WrapperComponent>
      );
    };
  },
});
