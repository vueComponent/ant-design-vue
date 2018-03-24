/* eslint-disable no-unused-expressions,new-cap */
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import update from 'immutability-helper';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

injectGlobal`
  tr.drop-over-downward td {
    border-bottom: 2px dashed red;
  }

  tr.drop-over-upward td {
    border-top: 2px dashed red;
  }
`;

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps,
  } = props;
  const style = { cursor: 'move' };

  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
      />
    )
  );
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'd',
    render() {
      return <a href="#">Operations</a>;
    },
  },
];

class Demo extends React.Component {
  state = {
    data: [
      { a: '123', key: '1' },
      { a: 'cdd', b: 'edd', key: '2' },
      { a: '1333', c: 'eee', d: 2, key: '3' },
    ],
  }

  components = {
    body: {
      row: BodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
  }

  render() {
    return (
      <Table
        columns={columns}
        data={this.state.data}
        components={this.components}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
      />
    );
  }
}

Demo = DragDropContext(HTML5Backend)(Demo);

ReactDOM.render(
  <div>
    <h2>Integrate with react-dnd</h2>
    <Demo />
  </div>,
  document.getElementById('__react-content')
);
