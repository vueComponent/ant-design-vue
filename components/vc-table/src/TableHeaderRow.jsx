import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import { connect } from '../../_util/store';
import { mergeProps } from '../../_util/props-util';

const TableHeaderRow = {
  props: {
    index: PropTypes.number,
    fixed: PropTypes.string,
    columns: PropTypes.array,
    rows: PropTypes.array,
    row: PropTypes.array,
    components: PropTypes.object,
    height: PropTypes.any,
    customHeaderRow: PropTypes.func,
    prefixCls: PropTypes.prefixCls,
  },
  name: 'TableHeaderRow',
  render(h) {
    const { row, index, height, components, customHeaderRow, prefixCls } = this;
    const HeaderRow = components.header.row;
    const HeaderCell = components.header.cell;
    const rowProps = customHeaderRow(
      row.map(cell => cell.column),
      index,
    );
    const customStyle = rowProps ? rowProps.style : {};
    const style = { height, ...customStyle };
    if (style.height === null) {
      delete style.height;
    }
    return (
      <HeaderRow {...rowProps} style={style}>
        {row.map((cell, i) => {
          const { column, children, className, ...cellProps } = cell;
          const cls = cell.class || className;
          const customProps = column.customHeaderCell ? column.customHeaderCell(column) : {};

          const headerCellProps = mergeProps(
            {
              attrs: {
                ...cellProps,
              },
              class: cls,
            },
            {
              ...customProps,
              key: column.key || column.dataIndex || i,
            },
          );

          if (column.align) {
            headerCellProps.style = { ...customProps.style, textAlign: column.align };
            headerCellProps.class = classNames(customProps.cls, column.class, column.className, {
              [`${prefixCls}-align-${column.align}`]: !!column.align,
            });
          }

          if (typeof HeaderCell === 'function') {
            return HeaderCell(h, headerCellProps, children);
          }
          return <HeaderCell {...headerCellProps}>{children}</HeaderCell>;
        })}
      </HeaderRow>
    );
  },
};

function getRowHeight(state, props) {
  const { fixedColumnsHeadRowsHeight } = state;
  const { columns, rows, fixed } = props;
  const headerHeight = fixedColumnsHeadRowsHeight[0];

  if (!fixed) {
    return null;
  }

  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto';
    }
    return `${headerHeight / rows.length}px`;
  }
  return null;
}

export default connect((state, props) => {
  return {
    height: getRowHeight(state, props),
  };
})(TableHeaderRow);
