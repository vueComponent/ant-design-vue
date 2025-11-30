<docs>
---
order: 14
title:
  zh-CN: 筛选和排序
  en-US: Filter and sorter
---

## zh-CN

对某一列数据进行筛选，使用列的 `filters` 属性来指定需要筛选菜单的列，`onFilter` 用于筛选当前数据，`filterMultiple` 用于指定多选和单选。
使用 `default-filtered-value` 属性，设置列的默认筛选项。
对某一列数据进行排序，通过指定列的 `sorter` 函数即可启用排序按钮。`sorter: function(rowA, rowB) { ... }`，其中 `rowA`、`rowB` 为待比较的两行数据。
如果指定了 sortOrder 或 defaultSortOrder（值为 'ascend' 或 'descend'），该排序方向会作为第三个参数传入 sorter 函数，此时函数可写为： `function(rowA, rowB, sortOrder) { ... }`。
通过 `sort-directions` 属性可自定义排序切换顺序。该属性接受一个数组，切换排序时将按数组元素依次循环。当设置在  table props 上时，对所有列生效。
> 默认值：`['ascend', 'descend']`。
> 若需禁止恢复到“无排序”状态，可设为：`['ascend', 'descend', 'ascend']`。

## en-US

Use `filters` to specify the filter menu options for a column, `onFilter` to determine how the current data is filtered, and `filterMultiple` to indicate whether multiple or single selection is allowed.
Use `defaultFilteredValue` to apply a default filter to a column on initial render.
Use `sorter` to enable sorting for a column—the sort button will appear automatically when a `sorter` function is provided.
Use `defaultSortOrder` to apply an initial sort direction (`'ascend'` or `'descend'`) to a column on first render.
The `sorter` can be a function of the type `function(rowA, rowB) { ... }` for local sorting, where `rowA` and `rowB` are the two row records being compared.
If a `sortOrder` or `defaultSortOrder` is specified with the value `'ascend'` or `'descend'`, this value is passed as a third argument to the `sorter` function, which can then take the form: `function(rowA, rowB, sortOrder) { ... }`.
`sortDirections` defines the sorting cycle order for each column. Clicking the sort button cycles through the values in the array sequentially. When set on the table props, it applies to all columns.
> Default value: `['ascend', 'descend']`.
> To prevent returning to an unsorted state, set it to: `['ascend', 'descend', 'ascend']`.

</docs>

<template>
  <a-table :columns="columns" :data-source="data" @change="onChange" />
</template>
<script lang="ts" setup>
import type { TableColumnType, TableProps } from 'ant-design-vue';

type TableDataType = {
  key: string;
  name: string;
  age: number;
  address: string;
};

const columns: TableColumnType<TableDataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value: string, record: TableDataType) => record.name.indexOf(value) === 0,
    sorter: (a: TableDataType, b: TableDataType) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a: TableDataType, b: TableDataType) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    filterMultiple: false,
    onFilter: (value: string, record: TableDataType) => record.address.indexOf(value) === 0,
    sorter: (a: TableDataType, b: TableDataType) => a.address.length - b.address.length,
    sortDirections: ['descend', 'ascend'],
  },
];

const data: TableDataType[] = [
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
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];
const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
  console.log('params', pagination, filters, sorter);
};
</script>
