import classNames from '../../_util/classNames';
import PropTypes, { withUndefined } from '../../_util/vue-types';
import TableCell from './TableCell';
import { initDefaultProps, findDOMNode } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import warning from '../../_util/warning';
import { computed, inject } from 'vue';
function noop() {}
const TableRow = {
  name: 'TableRow',
  inheritAttrs: false,
  mixins: [BaseMixin],
  props: initDefaultProps(
    {
      customRow: PropTypes.func,
      // onRowClick: PropTypes.func,
      // onRowDoubleClick: PropTypes.func,
      // onRowContextMenu: PropTypes.func,
      // onRowMouseEnter: PropTypes.func,
      // onRowMouseLeave: PropTypes.func,
      record: PropTypes.object,
      prefixCls: PropTypes.string,
      // onHover: PropTypes.func,
      columns: PropTypes.array,
      index: PropTypes.number,
      rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      className: PropTypes.string,
      indent: PropTypes.number,
      indentSize: PropTypes.number,
      hasExpandIcon: PropTypes.func,
      fixed: withUndefined(PropTypes.oneOfType([PropTypes.string, PropTypes.looseBool])),
      renderExpandIcon: PropTypes.func,
      renderExpandIconCell: PropTypes.func,
      components: PropTypes.any,
      expandedRow: PropTypes.looseBool,
      isAnyColumnsFixed: PropTypes.looseBool,
      ancestorKeys: PropTypes.array.isRequired,
      expandIconColumnIndex: PropTypes.number,
      expandRowByClick: PropTypes.looseBool,
      // visible: PropTypes.looseBool,
      // hovered: PropTypes.looseBool,
      // height: PropTypes.any,
    },
    {
      // expandIconColumnIndex: 0,
      // expandRowByClick: false,
      hasExpandIcon() {},
      renderExpandIcon() {},
      renderExpandIconCell() {},
    },
  ),

  setup(props) {
    const store = inject('table-store', () => ({}));
    const visible = computed(() => {
      const { expandedRowKeys } = store;
      const { ancestorKeys } = props;
      return !!(ancestorKeys.length === 0 || ancestorKeys.every(k => expandedRowKeys.includes(k)));
    });
    const height = computed(() => {
      const { expandedRowsHeight, fixedColumnsBodyRowsHeight } = store;
      const { fixed, rowKey } = props;

      if (!fixed) {
        return null;
      }

      if (expandedRowsHeight[rowKey]) {
        return expandedRowsHeight[rowKey];
      }

      if (fixedColumnsBodyRowsHeight[rowKey]) {
        return fixedColumnsBodyRowsHeight[rowKey];
      }

      return null;
    });
    const hovered = computed(() => {
      const { currentHoverKey } = store;
      const { rowKey } = props;
      return currentHoverKey === rowKey;
    });
    return {
      store,
      visible,
      hovered,
      height,
    };
  },

  data() {
    this.rowRef = null;
    return {
      shouldRender: this.visible,
    };
  },

  mounted() {
    if (this.shouldRender) {
      this.$nextTick(() => {
        this.saveRowRef();
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.shouldRender = true;
      }
    },
  },

  updated() {
    if (this.shouldRender && !this.rowRef) {
      this.$nextTick(() => {
        this.saveRowRef();
      });
    }
  },
  methods: {
    onRowClick(event, rowPropFunc = noop) {
      const { record, index } = this;
      this.__emit('rowClick', record, index, event);
      rowPropFunc(event);
    },

    onRowDoubleClick(event, rowPropFunc = noop) {
      const { record, index } = this;
      this.__emit('rowDoubleClick', record, index, event);
      rowPropFunc(event);
    },

    onContextMenu(event, rowPropFunc = noop) {
      const { record, index } = this;
      this.__emit('rowContextmenu', record, index, event);
      rowPropFunc(event);
    },

    onMouseEnter(event, rowPropFunc = noop) {
      const { record, index, rowKey } = this;
      this.__emit('hover', true, rowKey);
      this.__emit('rowMouseenter', record, index, event);
      rowPropFunc(event);
    },

    onMouseLeave(event, rowPropFunc = noop) {
      const { record, index, rowKey } = this;
      this.__emit('hover', false, rowKey);
      this.__emit('rowMouseleave', record, index, event);
      rowPropFunc(event);
    },

    setExpandedRowHeight() {
      const { store, rowKey } = this;
      let { expandedRowsHeight } = store;
      const height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight = {
        ...expandedRowsHeight,
        [rowKey]: height,
      };
      store.expandedRowsHeight = expandedRowsHeight;
    },

    setRowHeight() {
      const { store, rowKey } = this;
      const { fixedColumnsBodyRowsHeight } = store;
      const height = this.rowRef.getBoundingClientRect().height;
      store.fixedColumnsBodyRowsHeight = {
        ...fixedColumnsBodyRowsHeight,
        [rowKey]: height,
      };
    },

    getStyle() {
      const { height, visible } = this;
      let style = this.$attrs.style || {};
      if (height) {
        style = { ...style, height };
      }

      if (!visible && !style.display) {
        style = { ...style, display: 'none' };
      }

      return style;
    },

    saveRowRef() {
      this.rowRef = findDOMNode(this);
      const { isAnyColumnsFixed, fixed, expandedRow, ancestorKeys } = this;
      if (!isAnyColumnsFixed) {
        return;
      }
      if (!fixed && expandedRow) {
        this.setExpandedRowHeight();
      }
      if (!fixed && ancestorKeys.length >= 0) {
        this.setRowHeight();
      }
    },
  },

  render() {
    if (!this.shouldRender) {
      return null;
    }

    const {
      prefixCls,
      columns,
      record,
      rowKey,
      index,
      customRow = noop,
      indent,
      indentSize,
      hovered,
      height,
      visible,
      components,
      hasExpandIcon,
      renderExpandIcon,
      renderExpandIconCell,
    } = this;
    const BodyRow = components.body.row;
    const BodyCell = components.body.cell;

    let className = this.$attrs.class || '';

    if (hovered) {
      className += ` ${prefixCls}-hover`;
    }

    const cells = [];

    renderExpandIconCell(cells);

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];

      warning(
        column.onCellClick === undefined,
        'column[onCellClick] is deprecated, please use column[customCell] instead.',
      );

      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          colIndex={i}
          column={column}
          key={column.key || column.dataIndex}
          expandIcon={hasExpandIcon(i) && renderExpandIcon()}
          component={BodyCell}
        />,
      );
    }

    const {
      class: customClass,
      className: customClassName,
      style: customStyle,
      ...rowProps
    } = customRow(record, index) || {};

    let style = { height: typeof height === 'number' ? `${height}px` : height };

    if (!visible) {
      style.display = 'none';
    }

    style = { ...style, ...customStyle };
    const rowClassName = classNames(
      prefixCls,
      className,
      `${prefixCls}-level-${indent}`,
      customClassName,
      customClass,
    );
    const bodyRowProps = {
      ...rowProps,
      style,
      onClick: e => {
        this.onRowClick(e, rowProps.onClick);
      },
      onDblclick: e => {
        this.onRowDoubleClick(e, rowProps.onDblclick);
      },
      onMouseenter: e => {
        this.onMouseEnter(e, rowProps.onMouseenter);
      },
      onMouseleave: e => {
        this.onMouseLeave(e, rowProps.onMouseleave);
      },
      onContextmenu: e => {
        this.onContextMenu(e, rowProps.onContextmenu);
      },
      class: rowClassName,
      'data-row-key': rowKey,
    };
    return <BodyRow {...bodyRowProps}>{cells}</BodyRow>;
  },
};

export default TableRow;
