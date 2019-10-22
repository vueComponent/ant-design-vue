<cn>
#### 可编辑单元格
带单元格编辑功能的表格。
</cn>

<us>
#### Editable Cells
Table with editable cells.
</us>

```tpl
<template>
  <div>
    <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
    <a-table bordered :dataSource="dataSource" :columns="columns">
      <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
  import EditableCell from './EditableCell';
  /*
   * EditableCell Code https://github.com/vueComponent/ant-design-vue/blob/master/components/table/demo/EditableCell.vue
   */
  export default {
    components: {
      EditableCell,
    },
    data() {
      return {
        dataSource: [
          {
            key: '0',
            name: 'Edward King 0',
            age: '32',
            address: 'London, Park Lane no. 0',
          },
          {
            key: '1',
            name: 'Edward King 1',
            age: '32',
            address: 'London, Park Lane no. 1',
          },
        ],
        count: 2,
        columns: [
          {
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            scopedSlots: { customRender: 'name' },
          },
          {
            title: 'age',
            dataIndex: 'age',
          },
          {
            title: 'address',
            dataIndex: 'address',
          },
          {
            title: 'operation',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
          },
        ],
      };
    },
    methods: {
      onCellChange(key, dataIndex, value) {
        const dataSource = [...this.dataSource];
        const target = dataSource.find(item => item.key === key);
        if (target) {
          target[dataIndex] = value;
          this.dataSource = dataSource;
        }
      },
      onDelete(key) {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter(item => item.key !== key);
      },
      handleAdd() {
        const { count, dataSource } = this;
        const newData = {
          key: count,
          name: `Edward King ${count}`,
          age: 32,
          address: `London, Park Lane no. ${count}`,
        };
        this.dataSource = [...dataSource, newData];
        this.count = count + 1;
      },
    },
  };
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
```
