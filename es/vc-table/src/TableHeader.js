import PropTypes from '../../_util/vue-types';
import TableHeaderRow from './TableHeaderRow';

function getHeaderRows(columns) {
  var currentRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var rows = arguments[2];

  rows = rows || [];
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach(function (column) {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    var cell = {
      key: column.key,
      className: column.className || column['class'] || '',
      children: column.title,
      column: column
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
  return rows.filter(function (row) {
    return row.length > 0;
  });
}

export default {
  name: 'TableHeader',
  props: {
    fixed: PropTypes.string,
    columns: PropTypes.array.isRequired,
    expander: PropTypes.object.isRequired

  },
  inject: {
    table: { 'default': {} }
  },

  render: function render() {
    var h = arguments[0];
    var _table = this.table,
        components = _table.sComponents,
        prefixCls = _table.prefixCls,
        showHeader = _table.showHeader,
        customHeaderRow = _table.customHeaderRow;
    var expander = this.expander,
        columns = this.columns,
        fixed = this.fixed;


    if (!showHeader) {
      return null;
    }

    var rows = getHeaderRows(columns);

    expander.renderExpandIndentCell(rows, fixed);

    var HeaderWrapper = components.header.wrapper;

    return h(
      HeaderWrapper,
      { 'class': prefixCls + '-thead' },
      [rows.map(function (row, index) {
        return h(TableHeaderRow, {
          key: index,
          attrs: { index: index,
            fixed: fixed,
            columns: columns,
            rows: rows,
            row: row,
            components: components,
            customHeaderRow: customHeaderRow
          }
        });
      })]
    );
  }
};