<docs>
---
order: 8
title:
  en-US: Expandable Row
  zh-CN: 可展开
---

## zh-CN

当表格内容较多不能一次性完全展示时。

## en-US

When there's too much information to show and the table can't display all at once.

</docs>

<template>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 2000 }" :expand-column-width="100">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <a>Delete</a>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <p style="margin: 0">
        {{ record.description }}
      </p>
    </template>
    <template #expandColumnTitle>
      <span style="color: red">More</span>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', fixed: true },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', key: 'action' },
];

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];
</script>
