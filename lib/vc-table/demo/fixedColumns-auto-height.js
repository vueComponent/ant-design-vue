'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable no-console,func-names,react/no-multi-comp */
var data = [{ a: '123', b: 'xxxxxxxx', d: 3, key: '1', title: 'hello' }, { a: 'cdd', b: 'edd12221', d: 3, key: '2', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '3', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '4', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '5', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '6', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '7', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '8', title: 'hello' }, { a: '133', c: 'edd12221', d: 2, key: '9', title: 'hello' }];
exports['default'] = {
  data: function data() {
    return {
      show: false
    };
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' }, { title: 'title3', dataIndex: 'c', key: 'c' }, { title: 'title4', dataIndex: 'b', key: 'd' }, { title: 'title5', dataIndex: 'b', key: 'e' }, { title: 'title6', dataIndex: 'b', key: 'f',
      customRender: function customRender() {
        return h(
          'div',
          { style: { height: '40px', lineHeight: '40px' } },
          ['\u6211\u5F88\u9AD8']
        );
      } }, { title: 'title7', dataIndex: 'b', key: 'g' }, { title: 'title8', dataIndex: 'b', key: 'h' }, { title: 'title9', dataIndex: 'b', key: 'i' }, { title: 'title10', dataIndex: 'b', key: 'j' }, { title: 'title11', dataIndex: 'b', key: 'k' }, { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' }];
    return h(
      'div',
      { style: { width: '800px' } },
      [h('h2', ['Fixed columns']), h(
        'button',
        {
          on: {
            'click': function click() {
              _this.show = true;
            }
          }
        },
        ['show Table']
      ), this.show ? h(_index2['default'], {
        attrs: {
          columns: columns,
          expandedRowRender: function expandedRowRender(record) {
            return record.title;
          },
          expandIconAsCell: true,
          scroll: { x: 1200 },
          data: data
        }
      }) : null]
    );
  }
};
module.exports = exports['default'];