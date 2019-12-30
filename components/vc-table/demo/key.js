/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      data: [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }],
    };
  },
  methods: {
    remove(index) {
      const rows = this.data;
      rows.splice(index, 1);
      this.data = rows;
    },

    handleClick(index) {
      this.remove(index);
    },

    checkbox(a) {
      return (
        <label>
          <input type="checkbox" />
          {a}
        </label>
      );
    },

    renderAction(o, row, index) {
      return (
        <a href="javascript:;" onClick={() => this.handleClick(index)}>
          Delete
        </a>
      );
    },
  },

  render() {
    const columns = [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100, customRender: this.checkbox },
      { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      { title: 'Operations', dataIndex: '', key: 'x', customRender: this.renderAction },
    ];
    return <Table columns={columns} data={this.data} class="table" rowKey={record => record.a} />;
  },
};
