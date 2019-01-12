import Table from '../index';
import '../assets/index.less';

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

export default {
  render() {
    const columns = [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
      { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      {
        title: 'Operations',
        dataIndex: '',
        key: 'd',
        customRender() {
          return <a href="#">Operations</a>;
        },
      },
    ];
    const row = {
      render() {
        return <tr style={{ color: 'red' }}>{this.$slots.default}</tr>;
      },
    };
    const components = {
      body: {
        row,
      },
    };
    return (
      <div>
        <h2>Integrate with styled-components</h2>
        <Table columns={columns} data={data} components={components} />
      </div>
    );
  },
};
