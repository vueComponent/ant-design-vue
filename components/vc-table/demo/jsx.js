/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const { ColumnGroup, Column } = Table;

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

ReactDOM.render(
  <div>
    <h2>JSX table</h2>
    <Table data={data}>
      <ColumnGroup title="Bazinga">
        <Column
          title="title1"
          dataIndex="a"
          key="a"
          width={100}
        />
        <Column
          id="123"
          title="title2"
          dataIndex="b"
          key="b"
          width={100}
        />
      </ColumnGroup>
      <Column
        title="title3"
        dataIndex="c"
        key="c"
        width={200}
      />
      <Column
        title="Operations"
        dataIndex=""
        key="d"
        render={() => <a href="#">Operations</a>}
      />
    </Table>
  </div>,
  document.getElementById('__react-content')
);
