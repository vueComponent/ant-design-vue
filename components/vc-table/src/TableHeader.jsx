import PropTypes from '../../_util/vue-types';
import TableHeaderRow from './TableHeaderRow';

function getHeaderRows(columns, currentRow = 0, rows) {
  rows = rows || [];
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach(column => {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    const cell = {
      key: column.key,
      className: column.className || column.class || '',
      children: column.title,
      column,
    };
    if (column.children) {
      getHeaderRows(column.children, currentRow + 1, rows);
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

    const rows = getHeaderRows(columns);

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
