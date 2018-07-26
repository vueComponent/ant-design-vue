'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable no-console,func-names,react/no-multi-comp */
var tableData = [{ key: 0, a: '123' }, { key: 1, a: 'cdd', b: 'edd' }, { key: 2, a: '1333', c: 'eee', d: 2 }];

exports['default'] = {
  data: function data() {
    return {
      data: tableData,
      expandedRowKeys: [],
      expandIconAsCell: true,
      expandRowByClick: false,
      columns: [{ title: 'title 1', dataIndex: 'a', key: 'a', width: 100 }, { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operation', dataIndex: '', key: 'x', customRender: this.renderAction }]
    };
  },

  methods: {
    onExpand: function onExpand(expanded, record) {
      console.log('onExpand', expanded, record);
    },
    onExpandedRowsChange: function onExpandedRowsChange(rows) {
      this.expandedRowKeys = rows;
    },
    onExpandIconAsCellChange: function onExpandIconAsCellChange(e) {
      this.expandIconAsCell = e.target.checked;
    },
    onExpandRowByClickChange: function onExpandRowByClickChange(e) {
      this.expandRowByClick = e.target.checked;
    },
    toggleButton: function toggleButton() {
      var _this = this;

      var h = this.$createElement;

      if (this.expandedRowKeys.length) {
        var closeAll = function closeAll() {
          _this.expandedRowKeys = [];
        };
        return h(
          'button',
          {
            on: {
              'click': closeAll
            }
          },
          ['Close All']
        );
      }
      var openAll = function openAll() {
        _this.expandedRowKeys = [0, 1, 2];
      };
      return h(
        'button',
        {
          on: {
            'click': openAll
          }
        },
        ['Expand All']
      );
    },
    remove: function remove(index) {
      var data = this.data;
      data.splice(index, 1);
      this.data = data;
    },
    expandedRowRender: function expandedRowRender(record) {
      var h = this.$createElement;

      // console.log(record);
      return h('p', ['extra: ', record.a]);
    },
    renderAction: function renderAction(o, row, index) {
      var _this2 = this;

      var h = this.$createElement;

      return h(
        'a',
        {
          attrs: { href: '#' },
          on: {
            'click': function click() {
              return _this2.remove(index);
            }
          }
        },
        ['Delete']
      );
    }
  },

  render: function render() {
    var h = arguments[0];
    var expandIconAsCell = this.expandIconAsCell,
        expandRowByClick = this.expandRowByClick,
        expandedRowKeys = this.expandedRowKeys,
        data = this.data;

    return h('div', [h('h2', ['expandedRowRender']), h('div', [this.toggleButton(), h('span', { style: { display: 'inline-block', width: '20px' } }), h('input', {
      attrs: {
        type: 'checkbox'
      },
      domProps: {
        'checked': expandIconAsCell
      },
      on: {
        'change': this.onExpandIconAsCellChange
      }
    }), 'expandIconAsCell', h('span', { style: { display: 'inline-block', width: '20px' } }), h('input', {
      attrs: {
        type: 'checkbox'
      },
      domProps: {
        'checked': expandRowByClick
      },
      on: {
        'change': this.onExpandRowByClickChange
      }
    }), 'expandRowByClick', h(_index2['default'], {
      attrs: {
        columns: this.columns,
        expandIconAsCell: expandIconAsCell,
        expandRowByClick: expandRowByClick,
        expandedRowRender: this.expandedRowRender,
        expandedRowKeys: expandedRowKeys,

        data: data
      },
      on: {
        'expandedRowsChange': this.onExpandedRowsChange,
        'expand': this.onExpand
      }
    })])]);
  }
};
module.exports = exports['default'];