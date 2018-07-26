'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _ColGroup = require('./ColGroup');

var _ColGroup2 = _interopRequireDefault(_ColGroup);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _ExpandableRow = require('./ExpandableRow');

var _ExpandableRow2 = _interopRequireDefault(_ExpandableRow);

var _propsUtil = require('../../_util/props-util');

var _store = require('../../_util/store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var BaseTable = {
  name: 'BaseTable',
  props: {
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    columns: _vueTypes2['default'].array.isRequired,
    tableClassName: _vueTypes2['default'].string.isRequired,
    hasHead: _vueTypes2['default'].bool.isRequired,
    hasBody: _vueTypes2['default'].bool.isRequired,
    store: _vueTypes2['default'].object.isRequired,
    expander: _vueTypes2['default'].object.isRequired,
    getRowKey: _vueTypes2['default'].func,
    isAnyColumnsFixed: _vueTypes2['default'].bool
  },
  inject: {
    table: { 'default': {} }
  },
  methods: {
    handleRowHover: function handleRowHover(isHover, key) {
      this.store.setState({
        currentHoverKey: isHover ? key : null
      });
    },
    renderRows: function renderRows(renderData, indent) {
      var _this = this;

      var ancestorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var h = this.$createElement;
      var _table = this.table,
          columnManager = _table.columnManager,
          components = _table.sComponents,
          prefixCls = _table.prefixCls,
          childrenColumnName = _table.childrenColumnName,
          rowClassName = _table.rowClassName,
          _table$$listeners = _table.$listeners,
          _table$$listeners$row = _table$$listeners.rowClick,
          onRowClick = _table$$listeners$row === undefined ? noop : _table$$listeners$row,
          _table$$listeners$row2 = _table$$listeners.rowDoubleclick,
          onRowDoubleClick = _table$$listeners$row2 === undefined ? noop : _table$$listeners$row2,
          _table$$listeners$row3 = _table$$listeners.rowContextmenu,
          onRowContextMenu = _table$$listeners$row3 === undefined ? noop : _table$$listeners$row3,
          _table$$listeners$row4 = _table$$listeners.rowMouseenter,
          onRowMouseEnter = _table$$listeners$row4 === undefined ? noop : _table$$listeners$row4,
          _table$$listeners$row5 = _table$$listeners.rowMouseleave,
          onRowMouseLeave = _table$$listeners$row5 === undefined ? noop : _table$$listeners$row5,
          _table$customRow = _table.customRow,
          customRow = _table$customRow === undefined ? noop : _table$customRow;
      var getRowKey = this.getRowKey,
          fixed = this.fixed,
          expander = this.expander,
          isAnyColumnsFixed = this.isAnyColumnsFixed;


      var rows = [];

      var _loop = function _loop(i) {
        var record = renderData[i];
        var key = getRowKey(record, i);
        var className = typeof rowClassName === 'string' ? rowClassName : rowClassName(record, i, indent);

        var onHoverProps = {};
        if (columnManager.isAnyColumnsFixed()) {
          onHoverProps.hover = _this.handleRowHover;
        }

        var leafColumns = void 0;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = columnManager.leafColumns();
        }

        var rowPrefixCls = prefixCls + '-row';
        var expandableRowProps = {
          props: (0, _extends3['default'])({}, expander.props, {
            fixed: fixed,
            index: i,
            prefixCls: rowPrefixCls,
            record: record,
            rowKey: key,
            needIndentSpaced: expander.needIndentSpaced
          }),
          key: key,
          on: {
            // ...expander.on,
            rowClick: onRowClick,
            expandedChange: expander.handleExpandChange
          },
          scopedSlots: {
            'default': function _default(expandableRow) {
              var tableRowProps = (0, _propsUtil.mergeProps)({
                props: {
                  fixed: fixed,
                  indent: indent,
                  record: record,
                  index: i,
                  prefixCls: rowPrefixCls,
                  childrenColumnName: childrenColumnName,
                  columns: leafColumns,
                  rowKey: key,
                  ancestorKeys: ancestorKeys,
                  components: components,
                  isAnyColumnsFixed: isAnyColumnsFixed,
                  customRow: customRow
                },
                on: (0, _extends3['default'])({
                  rowDoubleclick: onRowDoubleClick,
                  rowContextmenu: onRowContextMenu,
                  rowMouseenter: onRowMouseEnter,
                  rowMouseleave: onRowMouseLeave
                }, onHoverProps),
                'class': className,
                ref: 'row_' + i + '_' + indent
              }, expandableRow);
              return h(_TableRow2['default'], tableRowProps);
            }
          }
        };
        var row = h(_ExpandableRow2['default'], expandableRowProps);

        rows.push(row);

        expander.renderRows(_this.renderRows, rows, record, i, indent, fixed, key, ancestorKeys);
      };

      for (var i = 0; i < renderData.length; i++) {
        _loop(i);
      }
      return rows;
    }
  },

  render: function render() {
    var h = arguments[0];
    var _table2 = this.table,
        components = _table2.sComponents,
        prefixCls = _table2.prefixCls,
        scroll = _table2.scroll,
        data = _table2.data,
        getBodyWrapper = _table2.getBodyWrapper;
    var expander = this.expander,
        tableClassName = this.tableClassName,
        hasHead = this.hasHead,
        hasBody = this.hasBody,
        fixed = this.fixed,
        columns = this.columns;

    var tableStyle = {};

    if (!fixed && scroll.x) {
      // not set width, then use content fixed width
      if (scroll.x === true) {
        tableStyle.tableLayout = 'fixed';
      } else {
        tableStyle.width = typeof scroll.x === 'number' ? scroll.x + 'px' : scroll.x;
      }
    }

    var Table = hasBody ? components.table : 'table';
    var BodyWrapper = components.body.wrapper;

    var body = void 0;
    if (hasBody) {
      body = h(
        BodyWrapper,
        { 'class': prefixCls + '-tbody' },
        [this.renderRows(data, 0)]
      );
      if (getBodyWrapper) {
        body = getBodyWrapper(body);
      }
    }

    return h(
      Table,
      { 'class': tableClassName, style: tableStyle, key: 'table' },
      [h(_ColGroup2['default'], {
        attrs: { columns: columns, fixed: fixed }
      }), hasHead && h(_TableHeader2['default'], {
        attrs: { expander: expander, columns: columns, fixed: fixed }
      }), body]
    );
  }
};

exports['default'] = (0, _store.connect)()(BaseTable);
module.exports = exports['default'];