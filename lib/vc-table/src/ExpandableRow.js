'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _ExpandIcon = require('./ExpandIcon');

var _ExpandIcon2 = _interopRequireDefault(_ExpandIcon);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _store = require('../../_util/store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ExpandableRow = {
  mixins: [_BaseMixin2['default']],
  name: 'ExpandableRow',
  props: {
    prefixCls: _vueTypes2['default'].string.isRequired,
    rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]).isRequired,
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    record: _vueTypes2['default'].object.isRequired,
    indentSize: _vueTypes2['default'].number,
    needIndentSpaced: _vueTypes2['default'].bool.isRequired,
    expandRowByClick: _vueTypes2['default'].bool,
    expanded: _vueTypes2['default'].bool.isRequired,
    expandIconAsCell: _vueTypes2['default'].bool,
    expandIconColumnIndex: _vueTypes2['default'].number,
    childrenColumnName: _vueTypes2['default'].string,
    expandedRowRender: _vueTypes2['default'].func
    // onExpandedChange: PropTypes.func.isRequired,
    // onRowClick: PropTypes.func,
    // children: PropTypes.func.isRequired,
  },

  beforeDestroy: function beforeDestroy() {
    this.handleDestroy();
  },

  methods: {
    hasExpandIcon: function hasExpandIcon(columnIndex) {
      var expandRowByClick = this.expandRowByClick;

      return !this.tempExpandIconAsCell && !expandRowByClick && columnIndex === this.tempExpandIconColumnIndex;
    },
    handleExpandChange: function handleExpandChange(record, event) {
      var expanded = this.expanded,
          rowKey = this.rowKey;

      this.__emit('expandedChange', !expanded, record, event, rowKey);
    },
    handleDestroy: function handleDestroy() {
      var rowKey = this.rowKey,
          record = this.record;

      this.__emit('expandedChange', false, record, null, rowKey, true);
    },
    handleRowClick: function handleRowClick(record, index, event) {
      var expandRowByClick = this.expandRowByClick;

      if (expandRowByClick) {
        this.handleExpandChange(record, event);
      }
      this.__emit('rowClick', record, index, event);
    },
    renderExpandIcon: function renderExpandIcon() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          expanded = this.expanded,
          record = this.record,
          needIndentSpaced = this.needIndentSpaced;


      return h(_ExpandIcon2['default'], {
        attrs: {
          expandable: this.expandable,
          prefixCls: prefixCls,

          needIndentSpaced: needIndentSpaced,
          expanded: expanded,
          record: record
        },
        on: {
          'expand': this.handleExpandChange
        }
      });
    },
    renderExpandIconCell: function renderExpandIconCell(cells) {
      var h = this.$createElement;

      if (!this.tempExpandIconAsCell) {
        return;
      }
      var prefixCls = this.prefixCls;


      cells.push(h(
        'td',
        {
          'class': prefixCls + '-expand-icon-cell',
          key: 'rc-table-expand-icon-cell'
        },
        [this.renderExpandIcon()]
      ));
    }
  },

  render: function render() {
    var childrenColumnName = this.childrenColumnName,
        expandedRowRender = this.expandedRowRender,
        indentSize = this.indentSize,
        record = this.record,
        fixed = this.fixed,
        $scopedSlots = this.$scopedSlots;


    this.tempExpandIconAsCell = fixed !== 'right' ? this.expandIconAsCell : false;
    this.tempExpandIconColumnIndex = fixed !== 'right' ? this.expandIconColumnIndex : -1;
    var childrenData = record[childrenColumnName];
    this.expandable = !!(childrenData || expandedRowRender);
    var expandableRowProps = {
      props: {
        indentSize: indentSize,
        hasExpandIcon: this.hasExpandIcon,
        renderExpandIcon: this.renderExpandIcon,
        renderExpandIconCell: this.renderExpandIconCell
      },

      on: {
        rowClick: this.handleRowClick
      }

    };

    return $scopedSlots['default'] && $scopedSlots['default'](expandableRowProps);
  }
};

exports['default'] = (0, _store.connect)(function (_ref, _ref2) {
  var expandedRowKeys = _ref.expandedRowKeys;
  var rowKey = _ref2.rowKey;
  return {
    expanded: !!~expandedRowKeys.indexOf(rowKey)
  };
})(ExpandableRow);
module.exports = exports['default'];