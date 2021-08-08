import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import shallowEqual from '../../_util/shallowequal';
import TableRow from './TableRow';
import { remove } from './utils';
import { initDefaultProps, getOptionProps, getSlot } from '../../_util/props-util';
import { inject } from 'vue';

export const ExpandableTableProps = () => ({
  expandIconAsCell: PropTypes.looseBool,
  expandRowByClick: PropTypes.looseBool,
  expandedRowKeys: PropTypes.array,
  expandedRowClassName: PropTypes.func,
  defaultExpandAllRows: PropTypes.looseBool,
  defaultExpandedRowKeys: PropTypes.array,
  expandIconColumnIndex: PropTypes.number,
  expandedRowRender: PropTypes.func,
  expandIcon: PropTypes.func,
  childrenColumnName: PropTypes.string,
  indentSize: PropTypes.number,
  // onExpand: PropTypes.func,
  // onExpandedRowsChange: PropTypes.func,
  columnManager: PropTypes.object.isRequired,
  prefixCls: PropTypes.string.isRequired,
  data: PropTypes.array,
  getRowKey: PropTypes.func,
});

const ExpandableTable = {
  name: 'ExpandableTable',
  inheritAttrs: false,
  mixins: [BaseMixin],
  props: initDefaultProps(ExpandableTableProps(), {
    expandIconAsCell: false,
    expandedRowClassName: () => '',
    expandIconColumnIndex: 0,
    defaultExpandAllRows: false,
    defaultExpandedRowKeys: [],
    childrenColumnName: 'children',
    indentSize: 15,
  }),
  setup(props) {
    const store = inject('table-store', () => ({}));
    const {
      data,
      childrenColumnName,
      defaultExpandAllRows,
      expandedRowKeys,
      defaultExpandedRowKeys,
      getRowKey,
    } = props;

    let finalExpandedRowKeys = [];
    let rows = [...data];

    if (defaultExpandAllRows) {
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        finalExpandedRowKeys.push(getRowKey(row, i));
        rows = rows.concat(row[childrenColumnName] || []);
      }
    } else {
      finalExpandedRowKeys = expandedRowKeys || defaultExpandedRowKeys;
    }
    Object.assign(store, {
      expandedRowsHeight: {},
      expandedRowKeys: finalExpandedRowKeys,
    });
    return { store };
  },
  mounted() {
    this.handleUpdated();
  },
  updated() {
    this.handleUpdated();
  },
  watch: {
    expandedRowKeys(val) {
      this.$nextTick(() => {
        this.store.expandedRowKeys = val;
      });
    },
  },
  methods: {
    handleUpdated() {
      // We should record latest expanded rows to avoid multiple rows remove cause `onExpandedRowsChange` trigger many times
      this.latestExpandedRows = null;
    },
    handleExpandChange(expanded, record, event, rowKey, destroy = false) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      let { expandedRowKeys } = this.store;

      if (expanded) {
        // row was expaned
        expandedRowKeys = [...expandedRowKeys, rowKey];
      } else {
        // row was collapse
        const expandedRowIndex = expandedRowKeys.indexOf(rowKey);
        if (expandedRowIndex !== -1) {
          expandedRowKeys = remove(expandedRowKeys, rowKey);
        }
      }

      if (!this.expandedRowKeys) {
        this.store.expandedRowKeys = expandedRowKeys;
      }
      // De-dup of repeat call
      if (!this.latestExpandedRows || !shallowEqual(this.latestExpandedRows, expandedRowKeys)) {
        this.latestExpandedRows = expandedRowKeys;
        this.__emit('expandedRowsChange', expandedRowKeys);
      }

      if (!destroy) {
        this.__emit('expand', expanded, record);
      }
    },

    renderExpandIndentCell(rows, fixed) {
      const { prefixCls, expandIconAsCell } = this;
      if (!expandIconAsCell || fixed === 'right' || !rows.length) {
        return;
      }

      const iconColumn = {
        key: 'rc-table-expand-icon-cell',
        className: `${prefixCls}-expand-icon-th`,
        title: '',
        rowSpan: rows.length,
      };

      rows[0].unshift({ ...iconColumn, column: iconColumn });
    },

    renderExpandedRow(record, index, expandedRowRender, className, ancestorKeys, indent, fixed) {
      const { prefixCls, expandIconAsCell, indentSize } = this;
      const parentKey = ancestorKeys[ancestorKeys.length - 1];
      const rowKey = `${parentKey}-extra-row`;
      const components = {
        body: {
          row: 'tr',
          cell: 'td',
        },
      };
      let colCount;
      if (fixed === 'left') {
        colCount = this.columnManager.leftLeafColumns.value.length;
      } else if (fixed === 'right') {
        colCount = this.columnManager.rightLeafColumns.value.length;
      } else {
        colCount = this.columnManager.leafColumns.value.length;
      }
      const columns = [
        {
          key: 'extra-row',
          customRender: () => {
            const { expandedRowKeys } = this.store;
            const expanded = expandedRowKeys.includes(parentKey);
            return {
              props: { colSpan: colCount },
              children:
                fixed !== 'right'
                  ? expandedRowRender({ record, index, indent, expanded })
                  : '&nbsp;',
            };
          },
        },
      ];
      if (expandIconAsCell && fixed !== 'right') {
        columns.unshift({
          key: 'expand-icon-placeholder',
          customRender: () => null,
        });
      }

      return (
        <TableRow
          key={rowKey}
          columns={columns}
          class={className}
          rowKey={rowKey}
          ancestorKeys={ancestorKeys}
          prefixCls={`${prefixCls}-expanded-row`}
          indentSize={indentSize}
          indent={indent}
          fixed={fixed}
          components={components}
          expandedRow
          hasExpandIcon={() => {}}
        />
      );
    },

    renderRows(renderRows, rows, record, index, indent, fixed, parentKey, ancestorKeys) {
      const { expandedRowClassName, expandedRowRender, childrenColumnName } = this;
      const childrenData = record[childrenColumnName];
      const nextAncestorKeys = [...ancestorKeys, parentKey];
      const nextIndent = indent + 1;

      if (expandedRowRender) {
        rows.push(
          this.renderExpandedRow(
            record,
            index,
            expandedRowRender,
            expandedRowClassName(record, index, indent),
            nextAncestorKeys,
            nextIndent,
            fixed,
          ),
        );
      }

      if (childrenData) {
        rows.push(...renderRows(childrenData, nextIndent, nextAncestorKeys));
      }
    },
  },

  render() {
    const { data, childrenColumnName } = this;
    const props = getOptionProps(this);
    const needIndentSpaced = data.some(record => record[childrenColumnName]);

    return getSlot(this, 'default', {
      props: {
        ...props,
        ...this.$attrs,
      },
      needIndentSpaced,
      renderRows: this.renderRows,
      handleExpandChange: this.handleExpandChange,
      renderExpandIndentCell: this.renderExpandIndentCell,
    });
  },
};

export default ExpandableTable;
