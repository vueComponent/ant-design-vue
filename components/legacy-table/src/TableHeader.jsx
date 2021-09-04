import { inject } from 'vue';
import PropTypes from '../../_util/vue-types';
import TableHeaderRow from './TableHeaderRow';

function parseHeaderRows(rootColumns) {
  const rows = [];

  function fillRowCells(columns, colIndex, rowIndex = 0) {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans = columns.filter(Boolean).map(column => {
      const cell = {
        key: column.key,
        className: column.className || column.class || '',
        children: column.title,
        column,
        colStart: currentColIndex,
      };

      let colSpan = 1;

      const subColumns = column.children;
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

export default {
  name: 'TableHeader',
  inheritAttrs: false,
  props: {
    fixed: PropTypes.string,
    columns: PropTypes.array.isRequired,
    expander: PropTypes.object.isRequired,
  },
  setup() {
    return {
      table: inject('table', {}),
    };
  },

  render() {
    const { sComponents: components, prefixCls, showHeader, customHeaderRow } = this.table;
    const { expander, columns, fixed } = this;

    if (!showHeader) {
      return null;
    }
    const rows = parseHeaderRows(this.columns);
    expander.renderExpandIndentCell(rows, fixed);

    const HeaderWrapper = components.header.wrapper;

    return (
      <HeaderWrapper class={`${prefixCls}-thead`}>
        {rows.map((row, index) => (
          <TableHeaderRow
            prefixCls={prefixCls}
            key={index}
            index={index}
            fixed={fixed}
            columns={columns}
            rows={rows}
            row={row}
            components={components}
            customHeaderRow={customHeaderRow}
          />
        ))}
      </HeaderWrapper>
    );
  },
};
