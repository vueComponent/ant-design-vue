import PropTypes from '../../_util/vue-types';
import TableHeaderRow from './TableHeaderRow';

function getHeaderRows({ columns = [], currentRow = 0, rows = [], isLast = true }) {
  rows = rows || [];
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach((column, i) => {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    const cellIsLast = isLast && i === columns.length - 1;
    const cell = {
      key: column.key,
      className: column.className || column.class || '',
      children: column.title,
      isLast: cellIsLast,
      column,
    };
    if (column.children) {
      getHeaderRows({
        columns: column.children,
        currentRow: currentRow + 1,
        rows,
        isLast: cellIsLast,
      });
    }
    if ('colSpan' in column) {
      cell.colSpan = column.colSpan;
    }
    if ('rowSpan' in column) {
      cell.rowSpan = column.rowSpan;
    }
    if (cell.colSpan !== 0) {
      rows[currentRow].push(cell);
    }
  });
  return rows.filter(row => row.length > 0);
}

export default {
  name: 'TableHeader',
  props: {
    fixed: PropTypes.string,
    columns: PropTypes.array.isRequired,
    expander: PropTypes.object.isRequired,
  },
  inject: {
    table: { default: () => ({}) },
  },

  render() {
    const { sComponents: components, prefixCls, showHeader, customHeaderRow } = this.table;
    const { expander, columns, fixed } = this;

    if (!showHeader) {
      return null;
    }

    const rows = getHeaderRows({ columns });

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
