<docs>
---
order: 4
title:
  en-US: ColSpan and rowSpan
  zh-CN: 表格行/列合并
---

## zh-CN

表头只支持列合并，使用 column 里的 colSpan 进行设置。
表格支持行/列合并，使用 render 里的单元格属性 colSpan 或者 rowSpan 设值为 0 时，设置的表格不会渲染。

## en-US

Table column title supports `colSpan` that set in `column`.
Table cell supports `colSpan` and `rowSpan` that set in render return object. When each of them is set to `0`, the cell will not be rendered.

</docs>

<template>
  <a-table :columns="columns" :data-source="data" bordered>
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        <a href="javascript:;">{{ text }}</a>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
const sharedOnCell = (_, index) => {
  if (index === 4) {
    return { colSpan: 0 };
  }
};

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    tel: '0571-22098909',
    phone: 18889898989,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    tel: '0571-22098333',
    phone: 18889898888,
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jake White',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Dublin No. 2 Lake Park',
  },
];

export default defineComponent({
  setup() {
    const columns: TableColumnType[] = [
      {
        title: 'Name',
        dataIndex: 'name',
        customCell: (_, index) => ({
          colSpan: index < 4 ? 1 : 5,
        }),
      },
      {
        title: 'Age',
        dataIndex: 'age',
        customCell: sharedOnCell,
      },
      {
        title: 'Home phone',
        colSpan: 2,
        dataIndex: 'tel',
        customCell: (_, index) => {
          if (index === 2) {
            return { rowSpan: 2 };
          }
          // These two are merged into above cell
          if (index === 3) {
            return { rowSpan: 0 };
          }
          if (index === 4) {
            return { colSpan: 0 };
          }
        },
      },
      {
        title: 'Phone',
        colSpan: 0,
        dataIndex: 'phone',
        customCell: sharedOnCell,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        customCell: sharedOnCell,
      },
    ];
    return {
      data,
      columns,
    };
  },
});
</script>
