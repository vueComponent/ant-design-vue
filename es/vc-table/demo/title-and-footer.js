/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from '../index';
import '../assets/index.less';

var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];

export default {
  render: function render() {
    var h = arguments[0];

    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, {
      title: 'Operations', dataIndex: '', key: 'd', customRender: function customRender() {
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
    return h('div', [h('h2', ['title and footer']), h(Table, {
      attrs: {
        columns: columns,
        data: data,
        title: function title(currentData) {
          return h('div', ['Title: ', currentData.length, ' items']);
        },
        footer: function footer(currentData) {
          return h('div', ['Footer: ', currentData.length, ' items']);
        }
      }
    })]);
  }
};