'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _store = require('../../_util/store');

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _utils = require('./utils');

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var TableRow = {
  name: 'TableRow',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)({
    customRow: _vueTypes2['default'].func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // onRowContextMenu: PropTypes.func,
    // onRowMouseEnter: PropTypes.func,
    // onRowMouseLeave: PropTypes.func,
    record: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    // onHover: PropTypes.func,
    columns: _vueTypes2['default'].array,
    height: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    index: _vueTypes2['default'].number,
    rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]).isRequired,
    className: _vueTypes2['default'].string,
    indent: _vueTypes2['default'].number,
    indentSize: _vueTypes2['default'].number,
    hasExpandIcon: _vueTypes2['default'].func.isRequired,
    hovered: _vueTypes2['default'].bool.isRequired,
    visible: _vueTypes2['default'].bool.isRequired,
    store: _vueTypes2['default'].object.isRequired,
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    renderExpandIcon: _vueTypes2['default'].func,
    renderExpandIconCell: _vueTypes2['default'].func,
    components: _vueTypes2['default'].any,
    expandedRow: _vueTypes2['default'].bool,
    isAnyColumnsFixed: _vueTypes2['default'].bool,
    ancestorKeys: _vueTypes2['default'].array.isRequired,
    expandIconColumnIndex: _vueTypes2['default'].number,
    expandRowByClick: _vueTypes2['default'].bool
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
      expandedRowsHeight = (0, _extends4['default'])({}, expandedRowsHeight, (0, _defineProperty3['default'])({}, rowKey, height));
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

      var style = (0, _propsUtil.getStyle)(this);
      if (height) {
        style = (0, _extends4['default'])({}, style, { height: height });
      }

      if (!visible && !style.display) {
        style = (0, _extends4['default'])({}, style, { display: 'none' });
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

      (0, _utils.warningOnce)(column.onCellClick === undefined, 'column[onCellClick] is deprecated, please use column[customCell] instead.');

      cells.push(h(_TableCell2['default'], {
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

    style = (0, _extends4['default'])({}, style, customStyle);
    var bodyRowProps = (0, _propsUtil.mergeProps)({
      on: {
        click: this.onRowClick,
        dblclick: this.onRowDoubleClick,
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave,
        contextmenu: this.onContextMenu
      },
      'class': rowClassName
    }, (0, _extends4['default'])({}, rowProps, { style: style }));
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

exports['default'] = (0, _store.connect)(function (state, props) {
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
module.exports = exports['default'];