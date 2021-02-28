import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import TableCell from './TableCell';
import { initDefaultProps, mergeProps, getStyle } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import warning from '../../_util/warning';
function noop() {}
const TableRow = {
  name: 'TableRow',
  mixins: [BaseMixin],
  inject: {
    store: { from: 'table-store', default: () => ({}) },
  },
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
      fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      renderExpandIcon: PropTypes.func,
      renderExpandIconCell: PropTypes.func,
      components: PropTypes.any,
      expandedRow: PropTypes.bool,
      isAnyColumnsFixed: PropTypes.bool,
      ancestorKeys: PropTypes.array.isRequired,
      expandIconColumnIndex: PropTypes.number,
      expandRowByClick: PropTypes.bool,
      // visible: PropTypes.bool,
      // hovered: PropTypes.bool,
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

  computed: {
    visible() {
      const { expandedRowKeys } = this.store;
      const { ancestorKeys } = this.$props;
      return !!(ancestorKeys.length === 0 || ancestorKeys.every(k => expandedRowKeys.includes(k)));
    },
    height() {
      const { expandedRowsHeight, fixedColumnsBodyRowsHeight } = this.store;
      const { fixed, rowKey } = this.$props;

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
    },
    hovered() {
      const { currentHoverKey } = this.store;
      const { rowKey } = this.$props;
      return currentHoverKey === rowKey;
    },
  },

  data() {
    // this.shouldRender = this.visible
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
    visible: {
      handler(val) {
        if (val) {
          this.shouldRender = true;
        }
      },
      immediate: true,
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
      let style = getStyle(this);
      if (height) {
        style = { ...style, height };
      }

      if (!visible && !style.display) {
        style = { ...style, display: 'none' };
      }

      return style;
    },

    saveRowRef() {
      this.rowRef = this.$el;

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

    let className = '';

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
          column={column}
          key={column.key || column.dataIndex}
          expandIcon={hasExpandIcon(i) && renderExpandIcon()}
          component={BodyCell}
        />,
      );
    }

    const { class: customClass, className: customClassName, style: customStyle, ...rowProps } =
      customRow(record, index) || {};

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
    const rowPropEvents = rowProps.on || {};
    const bodyRowProps = mergeProps(
      { ...rowProps, style },
      {
        on: {
          click: e => {
            this.onRowClick(e, rowPropEvents.click);
          },
          dblclick: e => {
            this.onRowDoubleClick(e, rowPropEvents.dblclick);
          },
          mouseenter: e => {
            this.onMouseEnter(e, rowPropEvents.mouseenter);
          },
          mouseleave: e => {
            this.onMouseLeave(e, rowPropEvents.mouseleave);
          },
          contextmenu: e => {
            this.onContextMenu(e, rowPropEvents.contextmenu);
          },
        },
        class: rowClassName,
      },
      {
        attrs: {
          'data-row-key': rowKey,
        },
      },
    );
    return <BodyRow {...bodyRowProps}>{cells}</BodyRow>;
  },
};

export default TableRow;
