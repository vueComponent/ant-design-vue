<docs>
---
order: 2
title:
  en-US: selection
  zh-CN: 可选择
---

## zh-CN
第一列是联动的选择框。
默认点击 checkbox 触发选择行为，需要 `点击行` 触发可参考例子：https://codesandbox.io/s/row-selection-on-click-tr58v

## en-US
Rows can be selectable by making first column as a selectable column.
selection happens when clicking checkbox defaultly. You can see https://codesandbox.io/s/row-selection-on-click-tr58v if you need row-click selection behavior.

</docs>

<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="data">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        <a>{{ text }}</a>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { TableProps, TableColumnType } from 'ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnType<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data: DataType[] = [
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
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];

export default defineComponent({
  setup() {
    const rowSelection: TableProps['rowSelection'] = {
      onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record: DataType) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return {
      data,
      columns,
      rowSelection,
    };
  },
});
</script>
