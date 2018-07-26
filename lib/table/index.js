'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Table = {
  name: 'ATable',
  Column: _Table2['default'].Column,
  ColumnGroup: _Table2['default'].ColumnGroup,
  props: _Table2['default'].props,
  methods: {
    normalize: function normalize() {
      var _this = this;

      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var columns = [];
      elements.forEach(function (element) {
        if (!element.tag) {
          return;
        }
        var key = (0, _propsUtil.getKey)(element);
        var style = (0, _propsUtil.getStyle)(element);
        var cls = (0, _propsUtil.getClass)(element);
        var props = (0, _propsUtil.getOptionProps)(element);
        var events = (0, _propsUtil.getEvents)(element);
        var listeners = {};
        Object.keys(events).forEach(function (e) {
          var k = 'on-' + e;
          listeners[(0, _propsUtil.camelize)(k)] = events[e];
        });

        var _getSlots = (0, _propsUtil.getSlots)(element),
            children = _getSlots['default'],
            restSlots = (0, _objectWithoutProperties3['default'])(_getSlots, ['default']);

        var column = (0, _extends3['default'])({}, restSlots, props, { style: style, 'class': cls }, listeners);
        if (key) {
          column.key = key;
        }
        if ((0, _propsUtil.getSlotOptions)(element).__ANT_TABLE_COLUMN_GROUP) {
          column.children = _this.normalize(children);
        } else {
          var customRender = element.data && element.data.scopedSlots && element.data.scopedSlots['default'];
          column.customRender = column.customRender || customRender;
        }
        columns.push(column);
      });
      return columns;
    },
    updateColumns: function updateColumns() {
      var _this2 = this;

      var cols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var columns = [];
      var $slots = this.$slots,
          $scopedSlots = this.$scopedSlots;

      cols.forEach(function (col) {
        var _col$slots = col.slots,
            slots = _col$slots === undefined ? {} : _col$slots,
            _col$scopedSlots = col.scopedSlots,
            scopedSlots = _col$scopedSlots === undefined ? {} : _col$scopedSlots,
            restProps = (0, _objectWithoutProperties3['default'])(col, ['slots', 'scopedSlots']);

        var column = (0, _extends3['default'])({}, restProps);
        Object.keys(slots).forEach(function (key) {
          var name = slots[key];
          if (column[key] === undefined && $slots[name]) {
            column[key] = $slots[name];
          }
        });
        Object.keys(scopedSlots).forEach(function (key) {
          var name = scopedSlots[key];
          if (column[key] === undefined && $scopedSlots[name]) {
            column[key] = $scopedSlots[name];
          }
        });
        // if (slotScopeName && $scopedSlots[slotScopeName]) {
        //   column.customRender = column.customRender || $scopedSlots[slotScopeName]
        // }
        if (col.children) {
          column.children = _this2.updateColumns(column.children);
        }
        columns.push(column);
      });
      return columns;
    }
  },
  render: function render() {
    var h = arguments[0];
    var $listeners = this.$listeners,
        $slots = this.$slots,
        normalize = this.normalize,
        $scopedSlots = this.$scopedSlots;

    var props = (0, _propsUtil.getOptionProps)(this);
    var columns = props.columns ? this.updateColumns(props.columns) : normalize($slots['default']);
    var title = props.title,
        footer = props.footer;
    var slotTitle = $scopedSlots.title,
        slotFooter = $scopedSlots.footer,
        _$scopedSlots$expande = $scopedSlots.expandedRowRender,
        expandedRowRender = _$scopedSlots$expande === undefined ? props.expandedRowRender : _$scopedSlots$expande;

    title = title || slotTitle;
    footer = footer || slotFooter;
    var tProps = {
      props: (0, _extends3['default'])({}, props, {
        columns: columns,
        title: title,
        footer: footer,
        expandedRowRender: expandedRowRender
      }),
      on: $listeners
    };
    return h(_Table2['default'], tProps);
  }
};

exports['default'] = Table;
module.exports = exports['default'];