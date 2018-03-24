/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const tableData = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

class Demo extends React.Component {
  state = {
    data: tableData,
    expandedRowKeys: [],
    expandIconAsCell: true,
    expandRowByClick: false,
  }

  onExpand = (expanded, record) => {
    console.log('onExpand', expanded, record);
  }

  onExpandedRowsChange = (rows) => {
    this.setState({
      expandedRowKeys: rows,
    });
  }

  onExpandIconAsCellChange = (e) => {
    this.setState({
      expandIconAsCell: e.target.checked,
    });
  }

  onExpandRowByClickChange = (e) => {
    this.setState({
      expandRowByClick: e.target.checked,
    });
  }

  columns = [
    { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
    { title: 'Operation', dataIndex: '', key: 'x', render: this.renderAction },
  ]

  toggleButton() {
    if (this.state.expandedRowKeys.length) {
      const closeAll = () => this.setState({ expandedRowKeys: [] });
      return <button onClick={closeAll}>Close All</button>;
    }
    const openAll = () => this.setState({ expandedRowKeys: [0, 1, 2] });
    return <button onClick={openAll}>Expand All</button>;
  }

  remove(index) {
    const data = this.state.data;
    data.splice(index, 1);
    this.setState({ data });
  }

  expandedRowRender(record) {
    // console.log(record);
    return <p>extra: {record.a}</p>;
  }

  renderAction(o, row, index) {
    return <a href="#" onClick={() => this.remove(index)}>Delete</a>;
  }

  render() {
    const { expandIconAsCell, expandRowByClick, expandedRowKeys, data } = this.state;
    return (
      <div>
        {this.toggleButton()}
        <span style={{ display: 'inline-block', width: 20 }} />
        <input
          type="checkbox"
          checked={expandIconAsCell}
          onChange={this.onExpandIconAsCellChange}
        />
        expandIconAsCell
        <span style={{ display: 'inline-block', width: 20 }} />
        <input
          type="checkbox"
          checked={expandRowByClick}
          onChange={this.onExpandRowByClickChange}
        />
        expandRowByClick
        <Table
          columns={this.columns}
          expandIconAsCell={expandIconAsCell}
          expandRowByClick={expandRowByClick}
          expandedRowRender={this.expandedRowRender}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={this.onExpandedRowsChange}
          onExpand={this.onExpand}
          data={data}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <h2>expandedRowRender</h2>
    <Demo />
  </div>,
  document.getElementById('__react-content')
);
