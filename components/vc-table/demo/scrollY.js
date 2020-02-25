/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

export default {
  data() {
    return {
      showBody: true,
    };
  },
  methods: {
    toggleBody() {
      this.showBody = !this.showBody;
    },
  },

  render() {
    const columns = [
      { title: 'title1', key: 'a', dataIndex: 'a', width: 100 },
      { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', key: 'c', dataIndex: 'c', width: 200 },
      {
        title: (
          <a onClick={this.toggleBody} href="javascript:;">
            {this.showBody ? '隐藏' : '显示'}体
          </a>
        ),
        key: 'x',
        width: 200,
        customRender() {
          return <a href="#">Operations</a>;
        },
      },
    ];
    return (
      <div>
        <h2>scroll body table</h2>
        <Table
          columns={columns}
          data={data}
          scroll={{ y: 300 }}
          rowKey={record => record.key}
          bodyStyle={{
            display: this.showBody ? '' : 'none',
          }}
        />
      </div>
    );
  },
};
