import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';
import { mergeProps, getListeners } from '../../_util/props-util';
function noop() {}
const BaseTable = {
  name: 'BaseTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    hasHead: PropTypes.bool.isRequired,
    hasBody: PropTypes.bool.isRequired,
    expander: PropTypes.object.isRequired,
    getRowKey: PropTypes.func,
    isAnyColumnsFixed: PropTypes.bool,
  },
  inject: {
    table: { default: () => ({}) },
    store: { from: 'table-store', default: () => ({}) },
  },
  methods: {
    getColumns(cols) {
      const { columns = [], fixed } = this.$props;
      const { table } = this;
      const { prefixCls } = table.$props;
      return (cols || columns).map(column => ({
        ...column,
        className:
          !!column.fixed && !fixed
            ? classNames(`${prefixCls}-fixed-columns-in-body`, column.className || column.class)
            : column.className || column.class,
      }));
    },
    handleRowHover(isHover, key) {
      this.store.currentHoverKey = isHover ? key : null;
    },

    renderRows(renderData, indent, ancestorKeys = []) {
      const {
        columnManager,
        sComponents: components,
        prefixCls,
        childrenColumnName,
        rowClassName,
        customRow = noop,
      } = this.table;
      const {
        rowClick: onRowClick = noop,
        rowDoubleclick: onRowDoubleClick = noop,
        rowContextmenu: onRowContextMenu = noop,
        rowMouseenter: onRowMouseEnter = noop,
        rowMouseleave: onRowMouseLeave = noop,
      } = getListeners(this.table);
      const { getRowKey, fixed, expander, isAnyColumnsFixed } = this;

      const rows = [];

      for (let i = 0; i < renderData.length; i += 1) {
        const record = renderData[i];
        const key = getRowKey(record, i);
        const className =
          typeof rowClassName === 'string' ? rowClassName : rowClassName(record, i, indent);

        const onHoverProps = {};
        if (columnManager.isAnyColumnsFixed()) {
          onHoverProps.hover = this.handleRowHover;
        }

        let leafColumns;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = this.getColumns(columnManager.leafColumns());
        }

        const rowPrefixCls = `${prefixCls}-row`;

        const expandableRowProps = {
          props: {
            ...expander.props,
            fixed,
            index: i,
            prefixCls: rowPrefixCls,
            record,
            rowKey: key,
            needIndentSpaced: expander.needIndentSpaced,
          },
          key,
          on: {
            // ...expander.on,
            rowClick: onRowClick,
            expandedChange: expander.handleExpandChange,
          },
          scopedSlots: {
            default: expandableRow => {
              const tableRowProps = mergeProps(
                {
                  props: {
                    fixed,
                    indent,
                    record,
                    index: i,
                    prefixCls: rowPrefixCls,
                    childrenColumnName,
                    columns: leafColumns,
                    rowKey: key,
                    ancestorKeys,
                    components,
                    isAnyColumnsFixed,
                    customRow,
                  },
                  on: {
                    rowDoubleclick: onRowDoubleClick,
                    rowContextmenu: onRowContextMenu,
                    rowMouseenter: onRowMouseEnter,
                    rowMouseleave: onRowMouseLeave,
                    ...onHoverProps,
                  },
                  class: className,
                  ref: `row_${i}_${indent}`,
                },
                expandableRow,
              );
              return <TableRow {...tableRowProps} />;
            },
          },
        };
        const row = <ExpandableRow {...expandableRowProps} />;

        rows.push(row);
        expander.renderRows(this.renderRows, rows, record, i, indent, fixed, key, ancestorKeys);
      }
      return rows;
    },
  },

  render() {
    const { sComponents: components, prefixCls, scroll, data, getBodyWrapper } = this.table;
    const { expander, tableClassName, hasHead, hasBody, fixed, isAnyColumnsFixed } = this.$props;
    const columns = this.getColumns();
    const tableStyle = {};

    if (!fixed && scroll.x) {
      // 当有固定列时，width auto 会导致 body table 的宽度撑不开，从而固定列无法对齐
      // 详情见：https://github.com/ant-design/ant-design/issues/22160
      const tableWidthScrollX = isAnyColumnsFixed ? 'max-content' : 'auto';
      // not set width, then use content fixed width
      tableStyle.width = scroll.x === true ? tableWidthScrollX : scroll.x;
      tableStyle.width =
        typeof tableStyle.width === 'number' ? `${tableStyle.width}px` : tableStyle.width;
    }
    if (fixed) {
      const width = columns.reduce((sum, { width: w }) => {
        return sum + parseFloat(w, 10);
      }, 0);
      if (width > 0) {
        tableStyle.width = width + 'px';
      }
    }

    const Table = hasBody ? components.table : 'table';
    const BodyWrapper = components.body.wrapper;

    let body;
    if (hasBody) {
      body = <BodyWrapper class={`${prefixCls}-tbody`}>{this.renderRows(data, 0)}</BodyWrapper>;
      if (getBodyWrapper) {
        body = getBodyWrapper(body);
      }
    }
    return (
      <Table class={tableClassName} style={tableStyle} key="table">
        <ColGroup columns={columns} fixed={fixed} />
        {hasHead && <TableHeader expander={expander} columns={columns} fixed={fixed} />}
        {body}
      </Table>
    );
  },
};

export default BaseTable;
