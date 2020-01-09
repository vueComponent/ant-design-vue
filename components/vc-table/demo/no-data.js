/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

const data = [];

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
    return (
      <div>
        <h2>simple table</h2>
        <Table columns={columns} data={data} />
      </div>
    );
  },
};
