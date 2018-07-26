import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import { connect } from '../../_util/store';
import TableCell from './TableCell';
import { warningOnce } from './utils';
import { initDefaultProps, mergeProps, getStyle as _getStyle } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
function noop() {}
var TableRow = {
  name: 'TableRow',
  mixins: [BaseMixin],
  props: initDefaultProps({
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
    hasExpandIcon: PropTypes.func.isRequired,
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
    expandRowByClick: PropTypes.bool
    // visible: PropTypes.bool,
    // hovered: PropTypes.bool,
    // height: PropTypes.any,
  }, {
    expandIconColumnIndex: 0,
    expandRowByClick: false,
    hasExpandIcon: function hasExpandIcon() {},
    renderExpandIcon: function renderExpandIcon() {},
    renderExpandIconCell: function renderExpandIconCell() {}
  }),

  data: function data() {
    this.shouldRender = this.visible;
    return {};
  },
  mounted: function mounted() {
    var _this = this;

    if (this.shouldRender) {
      this.$nextTick(function () {
        _this.saveRowRef();
      });
    }
  },

  watch: {
    visible: function visible(val) {
      if (val) {
        this.shouldRender = true;
      }
    }
  },

  updated: function updated() {
    var _this2 = this;

    if (this.shouldRender && !this.rowRef) {
      this.$nextTick(function () {
        _this2.saveRowRef();
      });
    }
  },

  methods: {
    onRowClick: function onRowClick(event) {
      var record = this.record,
          index = this.index;

      this.__emit('rowClick', record, index, event);
    },
    onRowDoubleClick: function onRowDoubleClick(event) {
      var record = this.record,
          index = this.index;

      this.__emit('rowDoubleClick', record, index, event);
    },
    onContextMenu: function onContextMenu(event) {
      var record = this.record,
          index = this.index;

      this.__emit('rowContextmenu', record, index, event);
    },
    onMouseEnter: function onMouseEnter(event) {
      var record = this.record,
          index = this.index,
          rowKey = this.rowKey;

      this.__emit('hover', true, rowKey);
      this.__emit('rowMouseenter', record, index, event);
    },
    onMouseLeave: function onMouseLeave(event) {
      var record = this.record,
          index = this.index,
          rowKey = this.rowKey;

      this.__emit('hover', false, rowKey);
      this.__emit('rowMouseleave', record, index, event);
    },
    setExpanedRowHeight: function setExpanedRowHeight() {
      var store = this.store,
          rowKey = this.rowKey;

      var _store$getState = store.getState(),
          expandedRowsHeight = _store$getState.expandedRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight = _extends({}, expandedRowsHeight, _defineProperty({}, rowKey, height));
      store.setState({ expandedRowsHeight: expandedRowsHeight });
    },
    setRowHeight: function setRowHeight() {
      var store = this.store,
          index = this.index;

      var fixedColumnsBodyRowsHeight = store.getState().fixedColumnsBodyRowsHeight.slice();
      var height = this.rowRef.getBoundingClientRect().height;
      fixedColumnsBodyRowsHeight[index] = height;
      store.setState({ fixedColumnsBodyRowsHeight: fixedColumnsBodyRowsHeight });
    },
    getStyle: function getStyle() {
      var height = this.height,
          visible = this.visible;

      var style = _getStyle(this);
      if (height) {
        style = _extends({}, style, { height: height });
      }

      if (!visible && !style.display) {
        style = _extends({}, style, { display: 'none' });
      }

      return style;
    },
    saveRowRef: function saveRowRef() {
      this.rowRef = this.$el;

      var isAnyColumnsFixed = this.isAnyColumnsFixed,
          fixed = this.fixed,
          expandedRow = this.expandedRow,
          ancestorKeys = this.ancestorKeys;


      if (!isAnyColumnsFixed) {
        return;
      }

      if (!fixed && expandedRow) {
        this.setExpanedRowHeight();
      }

      if (!fixed && ancestorKeys.length >= 0) {
        this.setRowHeight();
      }
    }
  },

  render: function render() {
    var h = arguments[0];

    if (!this.shouldRender) {
      return null;
    }

    var prefixCls = this.prefixCls,
        columns = this.columns,
        record = this.record,
        index = this.index,
        _customRow = this.customRow,
        customRow = _customRow === undefined ? noop : _customRow,
        indent = this.indent,
        indentSize = this.indentSize,
        hovered = this.hovered,
        height = this.height,
        visible = this.visible,
        components = this.components,
        hasExpandIcon = this.hasExpandIcon,
        renderExpandIcon = this.renderExpandIcon,
        renderExpandIconCell = this.renderExpandIconCell;

    var BodyRow = components.body.row;
    var BodyCell = components.body.cell;

    var className = '';

    if (hovered) {
      className += ' ' + prefixCls + '-hover';
    }

    var cells = [];

    renderExpandIconCell(cells);

    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];

      warningOnce(column.onCellClick === undefined, 'column[onCellClick] is deprecated, please use column[customCell] instead.');

      cells.push(h(TableCell, {
        attrs: {
          prefixCls: prefixCls,
          record: record,
          indentSize: indentSize,
          indent: indent,
          index: index,
          column: column,

          expandIcon: hasExpandIcon(i) && renderExpandIcon(),
          component: BodyCell
        },
        key: column.key || column.dataIndex }));
    }

    var rowClassName = (prefixCls + ' ' + className + ' ' + prefixCls + '-level-' + indent).trim();

    var rowProps = customRow(record, index);
    var customStyle = rowProps ? rowProps.style : {};
    var style = { height: typeof height === 'number' ? height + 'px' : height };

    if (!visible) {
      style.display = 'none';
    }

    style = _extends({}, style, customStyle);
    var bodyRowProps = mergeProps({
      on: {
        click: this.onRowClick,
        dblclick: this.onRowDoubleClick,
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave,
        contextmenu: this.onContextMenu
      },
      'class': rowClassName
    }, _extends({}, rowProps, { style: style }));
    return h(
      BodyRow,
      bodyRowProps,
      [cells]
    );
  }
};

function getRowHeight(state, props) {
  var expandedRowsHeight = state.expandedRowsHeight,
      fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
  var fixed = props.fixed,
      index = props.index,
      rowKey = props.rowKey;


  if (!fixed) {
    return null;
  }

  if (expandedRowsHeight[rowKey]) {
    return expandedRowsHeight[rowKey];
  }

  if (fixedColumnsBodyRowsHeight[index]) {
    return fixedColumnsBodyRowsHeight[index];
  }

  return null;
}

export default connect(function (state, props) {
  var currentHoverKey = state.currentHoverKey,
      expandedRowKeys = state.expandedRowKeys;
  var rowKey = props.rowKey,
      ancestorKeys = props.ancestorKeys;

  var visible = ancestorKeys.length === 0 || ancestorKeys.every(function (k) {
    return ~expandedRowKeys.indexOf(k);
  });

  return {
    visible: visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props)
  };
})(TableRow);