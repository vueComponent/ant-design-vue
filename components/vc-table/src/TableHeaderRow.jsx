import classNames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import { computed, inject } from 'vue';
import { getCellFixedInfo } from './fixUtil';

const TableHeaderRow = {
  name: 'TableHeaderRow',
  inheritAttrs: false,
  props: {
    index: PropTypes.number,
    fixed: PropTypes.string,
    columns: PropTypes.array,
    rows: PropTypes.array,
    row: PropTypes.array,
    components: PropTypes.object,
    customHeaderRow: PropTypes.func,
    prefixCls: PropTypes.prefixCls,
  },
  setup(props) {
    const store = inject('table-store', () => ({}));
    return {
      height: computed(() => {
        const { fixedColumnsHeadRowsHeight } = store;
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
      }),
      store,
    };
  },
  render() {
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
    const { stickyOffsets, columnManager } = this.store;
    return (
      <HeaderRow {...rowProps} style={style}>
        {row.map((cell, i) => {
          const { column, isLast, children, className, ...cellProps } = cell;
          const fixedInfo = getCellFixedInfo(
            cell.colStart,
            cell.colEnd,
            columnManager.leafColumns,
            stickyOffsets,
          );
          const customProps = column.customHeaderCell ? column.customHeaderCell(column) : {};
          const headerCellProps = {
            ...cellProps,
            ...customProps,
            key: column.key || column.dataIndex || i,
          };
          if (headerCellProps.colSpan === 0) {
            return null;
          }
          if (column.align) {
            headerCellProps.style = { ...customProps.style, textAlign: column.align };
          }
          // ====================== Fixed =======================
          const { fixLeft, fixRight, firstFixLeft, lastFixLeft, firstFixRight, lastFixRight } =
            fixedInfo;
          const fixedStyle = {};
          const isFixLeft = typeof fixLeft === 'number';
          const isFixRight = typeof fixRight === 'number';

          if (isFixLeft) {
            fixedStyle.position = 'sticky';
            fixedStyle.left = `${fixLeft}px`;
          }
          if (isFixRight) {
            fixedStyle.position = 'sticky';
            fixedStyle.right = `${fixRight}px`;
          }
          headerCellProps.class = classNames(
            customProps.class,
            customProps.className,
            column.class,
            column.className,
            {
              [`${prefixCls}-align-${column.align}`]: !!column.align,
              [`${prefixCls}-row-cell-ellipsis`]: !!column.ellipsis,
              [`${prefixCls}-row-cell-break-word`]: !!column.width,
              [`${prefixCls}-row-cell-last`]: isLast,
              [`${prefixCls}-cell-fix-left`]: isFixLeft,
              [`${prefixCls}-cell-fix-left-first`]: firstFixLeft,
              [`${prefixCls}-cell-fix-left-last`]: lastFixLeft,
              [`${prefixCls}-cell-fix-right`]: isFixRight,
              [`${prefixCls}-cell-fix-right-first`]: firstFixRight,
              [`${prefixCls}-cell-fix-right-last`]: lastFixRight,
            },
          );
          headerCellProps.style = { ...(headerCellProps.style || {}), ...fixedStyle };
          if (typeof HeaderCell === 'function') {
            return HeaderCell(headerCellProps, children);
          }
          return <HeaderCell {...headerCellProps}>{children}</HeaderCell>;
        })}
      </HeaderRow>
    );
  },
};

export default TableHeaderRow;
