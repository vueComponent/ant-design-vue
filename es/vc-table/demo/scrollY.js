/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from '../index';
import '../assets/index.less';

var data = [];
for (var i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: 'a' + i,
    b: 'b' + i,
    c: 'c' + i
  });
}

export default {
  data: function data() {
    return {
      showBody: true
    };
  },

  methods: {
    toggleBody: function toggleBody() {
      this.showBody = !this.showBody;
    }
  },

  render: function render() {
    var h = arguments[0];

    var columns = [{ title: 'title1', key: 'a', dataIndex: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', key: 'c', dataIndex: 'c', width: 200 }, {
      title: h(
        'a',
        {
          on: {
            'click': this.toggleBody
          },
          attrs: { href: 'javascript:;' }
        },
        [this.showBody ? '隐藏' : '显示', '\u4F53']
      ),
      key: 'x',
      width: 200,
      customRender: function customRender() {
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
    return h('div', [h('h2', ['scroll body table']), h(Table, {
      attrs: {
        columns: columns,
        data: data,
        scroll: { y: 300 },
        rowKey: function rowKey(record) {
          return record.key;
        },
        bodyStyle: {
          display: this.showBody ? '' : 'none'
        }
      }
    })]);
  }
};