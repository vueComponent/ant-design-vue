'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _store = require('../../_util/store');

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TableHeaderRow = {
  props: {
    index: _vueTypes2['default'].number,
    fixed: _vueTypes2['default'].string,
    columns: _vueTypes2['default'].array,
    rows: _vueTypes2['default'].array,
    row: _vueTypes2['default'].array,
    components: _vueTypes2['default'].object,
    height: _vueTypes2['default'].any,
    customHeaderRow: _vueTypes2['default'].func
  },
  name: 'TableHeaderRow',
  render: function render(h) {
    var row = this.row,
        index = this.index,
        height = this.height,
        components = this.components,
        customHeaderRow = this.customHeaderRow;

    var HeaderRow = components.header.row;
    var HeaderCell = components.header.cell;
    var rowProps = customHeaderRow(row.map(function (cell) {
      return cell.column;
    }), index);
    var customStyle = rowProps ? rowProps.style : {};
    var style = (0, _extends3['default'])({ height: height }, customStyle);

    return h(
      HeaderRow,
      (0, _babelHelperVueJsxMergeProps2['default'])([rowProps, { style: style }]),
      [row.map(function (cell, i) {
        var column = cell.column,
            children = cell.children,
            className = cell.className,
            cellProps = (0, _objectWithoutProperties3['default'])(cell, ['column', 'children', 'className']);

        var cls = cell['class'] || className;
        var customProps = column.customHeaderCell ? column.customHeaderCell(column) : {};

        var headerCellProps = (0, _propsUtil.mergeProps)({
          attrs: (0, _extends3['default'])({}, cellProps),
          'class': cls
        }, (0, _extends3['default'])({}, customProps, {
          key: column.key || column.dataIndex || i
        }));

        if (column.align) {
          headerCellProps.style = { textAlign: column.align };
        }

        if (typeof HeaderCell === 'function') {
          return HeaderCell(h, headerCellProps, children);
        }
        return h(
          HeaderCell,
          headerCellProps,
          [children]
        );
      })]
    );
  }
};

function getRowHeight(state, props) {
  var fixedColumnsHeadRowsHeight = state.fixedColumnsHeadRowsHeight;
  var columns = props.columns,
      rows = props.rows,
      fixed = props.fixed;

  var headerHeight = fixedColumnsHeadRowsHeight[0];

  if (!fixed) {
    return null;
  }

  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto';
    }
    return headerHeight / rows.length + 'px';
  }
  return null;
}

exports['default'] = (0, _store.connect)(function (state, props) {
  return {
    height: getRowHeight(state, props)
  };
})(TableHeaderRow);
module.exports = exports['default'];