/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from '../index';
import '../assets/index.less';

var ColumnGroup = Table.ColumnGroup,
    Column = Table.Column;


var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];

export default {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['JSX table']), h(
      Table,
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