/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import Menu, { Item, Divider } from 'rc-menu';
import DropDown from 'rc-dropdown';
import 'rc-table/assets/index.less';
import 'rc-dropdown/assets/index.css';
import 'rc-menu/assets/index.css';

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

class Demo extends React.Component {
  state = {
    visible: false,
  }

  filters = []

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  handleSelect = (selected) => {
    this.filters.push(selected);
  }

  handleDeselect = (key) => {
    const index = this.filters.indexOf(key);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  }

  confirmFilter = () => {
    console.log(this.filters.join(','));
    this.setState({
      visible: false,
    });
  }

  render() {
    const menu = (
      <Menu
        style={{ width: 200 }}
        multiple
        onSelect={this.handleSelect}
        onDeselect={this.handleDeselect}
      >
        <Item key="1">one</Item>
        <Item key="2">two</Item>
        <Item key="3">three</Item>
        <Divider />
        <Item disabled>
          <button
            style={{
              cursor: 'pointer',
              color: '#000',
              pointerEvents: 'visible',
            }}
            onClick={this.confirmFilter}
          >确定</button>
        </Item>
      </Menu>
    );

    const columns = [
      {
        title: (
          <div>
            title1
            <DropDown
              trigger={['click']}
              onVisibleChange={this.handleVisibleChange}
              visible={this.state.visible}
              overlay={menu}
            >
              <a href="#">filter</a>
            </DropDown>
          </div>
        ), key: 'a', dataIndex: 'a', width: 100,
      },
      { title: 'title2', key: 'b', dataIndex: 'b', width: 100 },
      { title: 'title3', key: 'c', dataIndex: 'c', width: 200 },
    ];

    return (
      <Table
        columns={columns}
        data={data}
        rowKey={record => record.key}
      />
    );
  }
}

ReactDOM.render(
  <div>
    <h2>use dropdown</h2>
    <Demo />
  </div>,
  document.getElementById('__react-content')
);
