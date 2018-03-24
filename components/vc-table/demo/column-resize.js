/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import 'rc-table/assets/index.less';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

ResizeableTitle.propTypes = {
  onResize: PropTypes.func.isRequired,
  width: PropTypes.number,
};

class Demo extends React.Component {
  state = {
    columns: [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
      { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      {
        title: 'Operations', dataIndex: '', key: 'd', render() {
          return <a href="#">Operations</a>;
        },
      },
    ],
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  }

  data = [
    { a: '123', key: '1' },
    { a: 'cdd', b: 'edd', key: '2' },
    { a: '1333', c: 'eee', d: 2, key: '3' },
  ]

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  }

  render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <div>
        <h2>Integrate with react-resizable</h2>
        <Table components={this.components} columns={columns} data={this.data} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
