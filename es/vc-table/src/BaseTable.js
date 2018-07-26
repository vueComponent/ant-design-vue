import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../../_util/vue-types';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';
import { mergeProps } from '../../_util/props-util';
import { connect } from '../../_util/store';
function noop() {}
var BaseTable = {
  name: 'BaseTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    hasHead: PropTypes.bool.isRequired,
    hasBody: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    expander: PropTypes.object.isRequired,
    getRowKey: PropTypes.func,
    isAnyColumnsFixed: PropTypes.bool
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
          props: _extends({}, expander.props, {
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
              var tableRowProps = mergeProps({
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
                on: _extends({
                  rowDoubleclick: onRowDoubleClick,
                  rowContextmenu: onRowContextMenu,
                  rowMouseenter: onRowMouseEnter,
                  rowMouseleave: onRowMouseLeave
                }, onHoverProps),
                'class': className,
                ref: 'row_' + i + '_' + indent
              }, expandableRow);
              return h(TableRow, tableRowProps);
            }
          }
        };
        var row = h(ExpandableRow, expandableRowProps);

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
      [h(ColGroup, {
        attrs: { columns: columns, fixed: fixed }
      }), hasHead && h(TableHeader, {
        attrs: { expander: expander, columns: columns, fixed: fixed }
      }), body]
    );
  }
};

export default connect()(BaseTable);