import { inject } from 'vue';
import PropTypes, { withUndefined } from '../../_util/vue-types';
import classNames from '../../_util/classNames';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';
function noop() {}
const BaseTable = {
  name: 'BaseTable',
  inheritAttrs: false,
  props: {
    fixed: withUndefined(PropTypes.oneOfType([PropTypes.string, PropTypes.looseBool])),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    hasHead: PropTypes.looseBool.isRequired,
    hasBody: PropTypes.looseBool.isRequired,
    expander: PropTypes.object.isRequired,
    getRowKey: PropTypes.func,
    isAnyColumnsFixed: PropTypes.looseBool,
  },
  setup() {
    return {
      table: inject('table', () => ({})),
      store: inject('table-store', () => ({})),
    };
  },
  methods: {
    getColumns(cols) {
      const { columns = [] } = this.$props;
      return (cols || columns).map(column => ({
        ...column,
        className: classNames(column.className, column.class),
      }));
    },
    handleRowHover(isHover, key) {
      this.store.currentHoverKey = isHover ? key : null;
    },

    renderRows(renderData, indent, ancestorKeys = []) {
      const {
        sComponents: components,
        prefixCls,
        childrenColumnName,
        rowClassName,
        customRow = noop,
        onRowClick = noop,
        onRowDoubleClick = noop,
        onRowContextMenu = noop,
        onRowMouseEnter = noop,
        onRowMouseLeave = noop,
        rowRef,
      } = { ...this.table.$attrs, ...this.table.$props, ...this.table.$data };
      const { columnManager } = this.store;
      const { getRowKey, fixed, expander, isAnyColumnsFixed } = this;

      const rows = [];

      for (let i = 0; i < renderData.length; i += 1) {
        const record = renderData[i];
        const key = getRowKey(record, i);
        const className =
          typeof rowClassName === 'string' ? rowClassName : rowClassName(record, i, indent);

        const onHoverProps = {};
        if (columnManager.isAnyColumnsFixed) {
          onHoverProps.onHover = this.handleRowHover;
        }

        let leafColumns;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns;
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns;
        } else {
          leafColumns = this.getColumns(columnManager.leafColumns);
        }

        const rowPrefixCls = `${prefixCls}-row`;

        const expandableRowProps = {
          ...expander.props,
          fixed,
          index: i,
          prefixCls: rowPrefixCls,
          record,
          rowKey: key,
          needIndentSpaced: expander.needIndentSpaced,
          key,
          onRowClick,
          onExpandedChange: expander.handleExpandChange,
        };
        const row = (
          <ExpandableRow
            {...expandableRowProps}
            v-slots={{
              default: expandableRow => {
                const tableRowProps = {
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
                  onRowDoubleClick,
                  onRowContextMenu,
                  onRowMouseEnter,
                  onRowMouseLeave,
                  ...onHoverProps,
                  class: className,
                  ref: rowRef(record, i, indent),
                  ...expandableRow,
                };
                return <TableRow {...tableRowProps} />;
              },
            }}
          />
        );

        rows.push(row);
        expander.renderRows(this.renderRows, rows, record, i, indent, fixed, key, ancestorKeys);
      }
      return rows;
    },
  },

  render() {
    const { sComponents: components, prefixCls, scroll, data } = this.table;
    const { expander, tableClassName, hasHead, hasBody, fixed } = this.$props;
    const columns = this.getColumns();
    const tableStyle = {};

    if (!fixed && scroll.x) {
      // not set width, then use content fixed width
      tableStyle.width = scroll.x === true ? 'auto' : scroll.x;
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
