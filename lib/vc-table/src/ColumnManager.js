'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ColumnManager = function () {
  function ColumnManager(columns) {
    (0, _classCallCheck3['default'])(this, ColumnManager);

    this.columns = columns;
    this._cached = {};
  }

  (0, _createClass3['default'])(ColumnManager, [{
    key: 'isAnyColumnsFixed',
    value: function isAnyColumnsFixed() {
      var _this = this;

      return this._cache('isAnyColumnsFixed', function () {
        return _this.columns.some(function (column) {
          return !!column.fixed;
        });
      });
    }
  }, {
    key: 'isAnyColumnsLeftFixed',
    value: function isAnyColumnsLeftFixed() {
      var _this2 = this;

      return this._cache('isAnyColumnsLeftFixed', function () {
        return _this2.columns.some(function (column) {
          return column.fixed === 'left' || column.fixed === true;
        });
      });
    }
  }, {
    key: 'isAnyColumnsRightFixed',
    value: function isAnyColumnsRightFixed() {
      var _this3 = this;

      return this._cache('isAnyColumnsRightFixed', function () {
        return _this3.columns.some(function (column) {
          return column.fixed === 'right';
        });
      });
    }
  }, {
    key: 'leftColumns',
    value: function leftColumns() {
      var _this4 = this;

      return this._cache('leftColumns', function () {
        return _this4.groupedColumns().filter(function (column) {
          return column.fixed === 'left' || column.fixed === true;
        });
      });
    }
  }, {
    key: 'rightColumns',
    value: function rightColumns() {
      var _this5 = this;

      return this._cache('rightColumns', function () {
        return _this5.groupedColumns().filter(function (column) {
          return column.fixed === 'right';
        });
      });
    }
  }, {
    key: 'leafColumns',
    value: function leafColumns() {
      var _this6 = this;

      return this._cache('leafColumns', function () {
        return _this6._leafColumns(_this6.columns);
      });
    }
  }, {
    key: 'leftLeafColumns',
    value: function leftLeafColumns() {
      var _this7 = this;

      return this._cache('leftLeafColumns', function () {
        return _this7._leafColumns(_this7.leftColumns());
      });
    }
  }, {
    key: 'rightLeafColumns',
    value: function rightLeafColumns() {
      var _this8 = this;

      return this._cache('rightLeafColumns', function () {
        return _this8._leafColumns(_this8.rightColumns());
      });
    }

    // add appropriate rowspan and colspan to column

  }, {
    key: 'groupedColumns',
    value: function groupedColumns() {
      var _this9 = this;

      return this._cache('groupedColumns', function () {
        var _groupColumns = function _groupColumns(columns) {
          var currentRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var parentColumn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var rows = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

          // track how many rows we got
          rows[currentRow] = rows[currentRow] || [];
          var grouped = [];
          var setRowSpan = function setRowSpan(column) {
            var rowSpan = rows.length - currentRow;
            if (column && !column.children && // parent columns are supposed to be one row
            rowSpan > 1 && (!column.rowSpan || column.rowSpan < rowSpan)) {
              column.rowSpan = rowSpan;
            }
          };
          columns.forEach(function (column, index) {
            var newColumn = (0, _extends3['default'])({}, column);
            rows[currentRow].push(newColumn);
            parentColumn.colSpan = parentColumn.colSpan || 0;
            if (newColumn.children && newColumn.children.length > 0) {
              newColumn.children = _groupColumns(newColumn.children, currentRow + 1, newColumn, rows);
              parentColumn.colSpan = parentColumn.colSpan + newColumn.colSpan;
            } else {
              parentColumn.colSpan++;
            }
            // update rowspan to all same row columns
            for (var i = 0; i < rows[currentRow].length - 1; ++i) {
              setRowSpan(rows[currentRow][i]);
            }
            // last column, update rowspan immediately
            if (index + 1 === columns.length) {
              setRowSpan(newColumn);
            }
            grouped.push(newColumn);
          });
          return grouped;
        };
        return _groupColumns(_this9.columns);
      });
    }
  }, {
    key: 'reset',
    value: function reset(columns) {
      this.columns = columns;
      this._cached = {};
    }
  }, {
    key: '_cache',
    value: function _cache(name, fn) {
      if (name in this._cached) {
        return this._cached[name];
      }
      this._cached[name] = fn();
      return this._cached[name];
    }
  }, {
    key: '_leafColumns',
    value: function _leafColumns(columns) {
      var _this10 = this;

      var leafColumns = [];
      columns.forEach(function (column) {
        if (!column.children) {
          leafColumns.push(column);
        } else {
          leafColumns.push.apply(leafColumns, (0, _toConsumableArray3['default'])(_this10._leafColumns(column.children)));
        }
      });
      return leafColumns;
    }
  }]);
  return ColumnManager;
}();

exports['default'] = ColumnManager;
module.exports = exports['default'];