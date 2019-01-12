import Table from '../index';
import '../assets/index.less';

const columns = [
  { title: 'First Name', dataIndex: 'names.first', key: 'a', width: 100 },
  { title: 'Last Name', dataIndex: 'names.last', key: 'b', width: 100 },
  { title: 'Age', dataIndex: 'age', key: 'c', width: 100 },
];

const data = [
  {
    age: '23',
    names: {
      first: 'John',
      last: 'Doe',
    },
    key: '1',
  },
  {
    age: '36',
    names: {
      first: 'Terry',
      last: 'Garner',
    },
    key: '2',
  },
  {
    age: '52',
    names: {
      first: 'Thomas',
      last: 'Goodwin',
    },
    key: '3',
  },
];
export default {
  render() {
    return (
      <div>
        <h2>Nested data table</h2>
        <Table columns={columns} data={data} class="table" />
      </div>
    );
  },
};
