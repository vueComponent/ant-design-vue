/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import Animate from 'rc-animate';
import 'rc-table/assets/index.less';
import 'rc-table/assets/animation.less';

const AnimateBody = (props) =>
  <Animate transitionName="move" component="tbody" {...props} />;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
      { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      {
        title: 'Operations', dataIndex: '', key: 'd', render: (text, record) =>
        <a onClick={e => this.onDelete(record.key, e)} href="#">Delete</a>,
      },
    ];
    this.state = {
      data: [
        { a: '123', key: '1' },
        { a: 'cdd', b: 'edd', key: '2' },
        { a: '1333', c: 'eee', key: '3' },
      ],
    };
  }

  onDelete(key, e) {
    console.log('Delete', key);
    e.preventDefault();
    const data = this.state.data.filter(item => item.key !== key);
    this.setState({ data });
  }

  onAdd() {
    const data = [...this.state.data];
    data.push({
      a: 'new data',
      b: 'new data',
      c: 'new data',
      key: Date.now(),
    });
    this.setState({ data });
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Table row with animation</h2>
        <button onClick={() => this.onAdd()}>添加</button>
        <Table
          columns={this.columns}
          data={this.state.data}
          components={{
            body: { wrapper: AnimateBody },
          }}
        />
      </div>
    );
  }
}
ReactDOM.render(
  <Demo />,
  document.getElementById('__react-content')
);
