'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable no-console,func-names,react/no-multi-comp */
var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];
exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var columns = [{ title: 'title1', dataIndex: 'a',
      className: 'a',
      key: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b',
      className: 'b',
      key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c',
      className: 'c',
      key: 'c', width: 200 }, {
      title: 'Operations', dataIndex: '',
      className: 'd',
      key: 'd', customRender: function customRender() {
        var h = this.$createElement;

        return h(
          'a',
          {
            attrs: { href: '#' }
          },
          ['Operations']
        );
      }
    }];
    return h('div', [h('h2', ['rowClassName and className']), h(_index2['default'], {
      attrs: {
        columns: columns,
        rowClassName: function rowClassName(record, i) {
          return 'row-' + i;
        },
        expandedRowRender: function expandedRowRender(record) {
          return h('p', ['extra: ', record.a]);
        },
        expandedRowClassName: function expandedRowClassName(record, i) {
          return 'ex-row-' + i;
        },
        data: data
      },
      'class': 'table'
    })]);
  }
};
module.exports = exports['default'];