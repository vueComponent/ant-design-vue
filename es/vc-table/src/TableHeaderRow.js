import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import { connect } from '../../_util/store';
import { mergeProps } from '../../_util/props-util';

var TableHeaderRow = {
  props: {
    index: PropTypes.number,
    fixed: PropTypes.string,
    columns: PropTypes.array,
    rows: PropTypes.array,
    row: PropTypes.array,
    components: PropTypes.object,
    height: PropTypes.any,
    customHeaderRow: PropTypes.func
  },
  name: 'TableHeaderRow',
  render: function render(h) {
    var row = this.row,
        index = this.index,
        height = this.height,
        components = this.components,
        customHeaderRow = this.customHeaderRow;

    var HeaderRow = components.header.row;
    var HeaderCell = components.header.cell;
    var rowProps = customHeaderRow(row.map(function (cell) {
      return cell.column;
    }), index);
    var customStyle = rowProps ? rowProps.style : {};
    var style = _extends({ height: height }, customStyle);

    return h(
      HeaderRow,
      _mergeJSXProps([rowProps, { style: style }]),
      [row.map(function (cell, i) {
        var column = cell.column,
            children = cell.children,
            className = cell.className,
            cellProps = _objectWithoutProperties(cell, ['column', 'children', 'className']);

        var cls = cell['class'] || className;
        var customProps = column.customHeaderCell ? column.customHeaderCell(column) : {};

        var headerCellProps = mergeProps({
          attrs: _extends({}, cellProps),
          'class': cls
        }, _extends({}, customProps, {
          key: column.key || column.dataIndex || i
        }));

        if (column.align) {
          headerCellProps.style = { textAlign: column.align };
        }

        if (typeof HeaderCell === 'function') {
          return HeaderCell(h, headerCellProps, children);
        }
        return h(
          HeaderCell,
          headerCellProps,
          [children]
        );
      })]
    );
  }
};

function getRowHeight(state, props) {
  var fixedColumnsHeadRowsHeight = state.fixedColumnsHeadRowsHeight;
  var columns = props.columns,
      rows = props.rows,
      fixed = props.fixed;

  var headerHeight = fixedColumnsHeadRowsHeight[0];

  if (!fixed) {
    return null;
  }

  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto';
    }
    return headerHeight / rows.length + 'px';
  }
  return null;
}

export default connect(function (state, props) {
  return {
    height: getRowHeight(state, props)
  };
})(TableHeaderRow);