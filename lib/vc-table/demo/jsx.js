'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable no-console,func-names,react/no-multi-comp */
var ColumnGroup = _index2['default'].ColumnGroup,
    Column = _index2['default'].Column;


var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['JSX table']), h(
      _index2['default'],
      {
        attrs: { data: data }
      },
      [h(ColumnGroup, [h(
        'span',
        { slot: 'title' },
        ['Bazingakkkk']
      ), h(Column, {
        attrs: {
          title: 'title1',
          dataIndex: 'a',

          width: 100
        },
        key: 'a' }), h(Column, {
        attrs: {
          id: '123',
          title: 'title2',
          dataIndex: 'b',

          width: 100
        },
        key: 'b' })]), h(Column, {
        attrs: {
          title: 'title3',
          dataIndex: 'c',

          width: 200
        },
        key: 'c' }), h(Column, {
        attrs: {
          title: 'Operations',
          dataIndex: ''
        },
        key: 'd'
        // render={() => <a href='#'>Operations</a>}
        , scopedSlots: { 'default': function _default() {
            return h(
              'a',
              {
                attrs: { href: '#' }
              },
              ['Operations']
            );
          } }
      })]
    )]);
  }
};
module.exports = exports['default'];