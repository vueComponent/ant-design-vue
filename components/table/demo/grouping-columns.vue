<docs>
---
order: 13
title:
  zh-CN: 表头分组
  en-US: Grouping table head
---

## zh-CN

`columns[n]` 可以内嵌 `children`，以渲染分组表头。

## en-US

Group table head with `columns[n].children`.

</docs>

<template>
  <a-table
    :columns="columns"
    :data-source="data"
    bordered
    size="middle"
    :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
type TableDataType = {
  key: number;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
};
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'John',
        value: 'John',
      },
    ],
    onFilter: (value: string, record: TableDataType) => record.name.indexOf(value) === 0,
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a: TableDataType, b: TableDataType) => a.age - b.age,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 200,
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
  },
];
const data = [...Array(100)].map((_, i) => ({
  key: i,
  name: 'John Brown',
  age: i + 1,
  street: 'Lake Park',
  building: 'C',
  number: 2035,
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
}));
export default defineComponent({
  setup() {
    return {
      data,
      columns,
    };
  },
});
</script>
