/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from '../index';
import '../assets/index.less';

var data = [];

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
    return h('div', [h('h2', ['simple table']), h(Table, {
      attrs: { columns: columns, data: data }
    })]);
  }
};