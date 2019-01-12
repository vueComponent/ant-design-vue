import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import { connect } from '../../_util/store';
import TableCell from './TableCell';
import { warningOnce } from './utils';
import { initDefaultProps, mergeProps, getStyle } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
function noop() {}
const TableRow = {
  name: 'TableRow',
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
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      index: PropTypes.number,
      rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      className: PropTypes.string,
      indent: PropTypes.number,
      indentSize: PropTypes.number,
      hasExpandIcon: PropTypes.func,
      hovered: PropTypes.bool.isRequired,
      visible: PropTypes.bool.isRequired,
      store: PropTypes.object.isRequired,
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
    onRowClick(event) {
      const { record, index } = this;
      this.__emit('rowClick', record, index, event);
    },

    onRowDoubleClick(event) {
      const { record, index } = this;
      this.__emit('rowDoubleClick', record, index, event);
    },

    onContextMenu(event) {
      const { record, index } = this;
      this.__emit('rowContextmenu', record, index, event);
    },

    onMouseEnter(event) {
      const { record, index, rowKey } = this;
      this.__emit('hover', true, rowKey);
      this.__emit('rowMouseenter', record, index, event);
    },

    onMouseLeave(event) {
      const { record, index, rowKey } = this;
      this.__emit('hover', false, rowKey);
      this.__emit('rowMouseleave', record, index, event);
    },

    setExpanedRowHeight() {
      const { store, rowKey } = this;
      let { expandedRowsHeight } = store.getState();
      const height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight = {
        ...expandedRowsHeight,
        [rowKey]: height,
      };
      store.setState({ expandedRowsHeight });
    },

    setRowHeight() {
      const { store, rowKey } = this;
      const { fixedColumnsBodyRowsHeight } = store.getState();
      const height = this.rowRef.getBoundingClientRect().height;
      store.setState({
        fixedColumnsBodyRowsHeight: {
          ...fixedColumnsBodyRowsHeight,
          [rowKey]: height,
        },
      });
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
        this.setExpanedRowHeight();
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

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      warningOnce(
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
    const bodyRowProps = mergeProps(
      {
        on: {
          click: this.onRowClick,
          dblclick: this.onRowDoubleClick,
          mouseenter: this.onMouseEnter,
          mouseleave: this.onMouseLeave,
          contextmenu: this.onContextMenu,
        },
        class: rowClassName,
      },
      { ...rowProps, style },
      {
        attrs: {
          'data-row-key': rowKey,
        },
      },
    );
    return <BodyRow {...bodyRowProps}>{cells}</BodyRow>;
  },
};

function getRowHeight(state, props) {
  const { expandedRowsHeight, fixedColumnsBodyRowsHeight } = state;
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
}

export default connect((state, props) => {
  const { currentHoverKey, expandedRowKeys } = state;
  const { rowKey, ancestorKeys } = props;
  const visible = ancestorKeys.length === 0 || ancestorKeys.every(k => ~expandedRowKeys.indexOf(k));

  return {
    visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props),
  };
})(TableRow);
