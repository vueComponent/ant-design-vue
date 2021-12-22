<cn>
#### 拖拽排序
使用`components` 自定义元素，我们可以集成 [vue-react-dnd](https://github.com/jenshaase/vue-react-dnd) 来实现拖拽排序。
</cn>

<us>
#### Drag sorting
By using `components`, we can integrate table with [vue-react-dnd](https://github.com/jenshaase/vue-react-dnd) to implement drag sorting function.
</us>

<template>
  <DragDropContextProvider :backend="html5Backend">
    <a-table
      :custom-row="customRow"
      :columns="columns"
      :data-source="data"
      :components="components"
    />
  </DragDropContextProvider>
</template>
<script>
import { DragDropContextProvider, DragSource, DropTarget } from 'vue-react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TYPE = 'DraggableRow';

const DraggableRow = {
  name: 'DraggableRow',
  mixins: [DragSource, DropTarget],
  inheritAttrs: false,
  data() {
    return {
      isDragging: false,
      isOver: false,
      dropClassName: '',
    };
  },
  computed: {
    // tricky, cannot get $attrs from self, cause of <BodyRow> does not pass props into row component.
    // https://github.com/vueComponent/ant-design-vue/blob/1.x/components/table/createBodyRow.jsx#L25
    pAttrs() {
      return this.$parent.$attrs;
    },
  },
  dragSource: {
    type: () => TYPE,
    specs: {
      beginDrag() {
        return {
          index: this.pAttrs.index,
        };
      },

      endDrag(monitor) {
        this.pAttrs.moveRow(monitor.getItem().index, monitor.getDropResult().index);
      },
    },
    collect(collect, monitor) {
      this.isDragging = monitor.isDragging();
    },
  },
  dropTarget: {
    type: () => TYPE,
    collect(collect, monitor) {
      const { index } = this.pAttrs;
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return;
      }

      this.isOver = monitor.isOver();
      this.dropClassName = dragIndex < index ? ' drop-over-downward' : ' drop-over-upward';
    },
    specs: {
      drop() {
        return {
          index: this.pAttrs.index,
        };
      },
    },
  },

  render() {
    const { $slots, pAttrs, isOver, dropClassName } = this;
    const directives = [{ name: 'dragSource' }, { name: 'dropTarget' }];

    return (
      <tr
        {...{ directives }}
        style={{ cursor: 'move', ...pAttrs.style }}
        class={[pAttrs.className, isOver ? dropClassName : '']}
      >
        {$slots.default}
      </tr>
    );
  },
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

export default {
  components: {
    DragDropContextProvider,
  },
  data() {
    return {
      html5Backend: HTML5Backend,
      data,
      columns,
      components: {
        body: {
          row: DraggableRow,
        },
      },
    };
  },
  methods: {
    moveRow(dragIndex, hoverIndex) {
      const draggingRow = this.data[dragIndex];
      const data = [...this.data];
      data.splice(dragIndex, 1);
      data.splice(hoverIndex, 0, draggingRow);
      this.data = data;
    },
    customRow(record, index) {
      return {
        attrs: {
          index,
          moveRow: this.moveRow,
        },
      };
    },
  },
};
</script>

<style>
.ant-table-body tr.drop-over-downward td {
  border-bottom: 2px dashed #1890ff;
}

.ant-table-body tr.drop-over-upward td {
  border-top: 2px dashed #1890ff;
}
</style>
