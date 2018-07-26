/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from '../index';
import '../assets/index.less';

export default {
  data: function data() {
    return {
      data: [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }]
    };
  },

  methods: {
    remove: function remove(index) {
      var rows = this.data;
      rows.splice(index, 1);
      this.data = rows;
    },
    handleClick: function handleClick(index) {
      this.remove(index);
    },
    checkbox: function checkbox(a) {
      var h = this.$createElement;

      return h('label', [h('input', {
        attrs: { type: 'checkbox' }
      }), a]);
    },
    renderAction: function renderAction(o, row, index) {
      var _this = this;

      var h = this.$createElement;

      return h(
        'a',
        {
          attrs: { href: 'javascript:;' },
          on: {
            'click': function click() {
              return _this.handleClick(index);
            }
          }
        },
        ['Delete']
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, customRender: this.checkbox }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operations', dataIndex: '', key: 'x', customRender: this.renderAction }];
    return h(Table, {
      attrs: { columns: columns, data: this.data, rowKey: function rowKey(record) {
          return record.a;
        } },
      'class': 'table' });
  }
};