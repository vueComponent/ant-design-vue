/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

const { ColumnGroup, Column } = Table;

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

export default {
  render() {
    return (
      <div>
        <h2>JSX table</h2>
        <Table data={data}>
          <ColumnGroup>
            <span slot="title">Bazingakkkk</span>
            <Column title="title1" dataIndex="a" key="a" width={100} />
            <Column id="123" title="title2" dataIndex="b" key="b" width={100} />
          </ColumnGroup>
          <Column title="title3" dataIndex="c" key="c" width={200} />
          <Column
            title="Operations"
            dataIndex=""
            key="d"
            // render={() => <a href='#'>Operations</a>}
            scopedSlots={{ default: () => <a href="#">Operations</a> }}
          />
        </Table>
      </div>
    );
  },
};
