<docs>
---
order: 99
title:
  en-US: Fixed header and scroll bar with the page
  zh-CN: 随页面滚动的固定表头和滚动条
---

## zh-CN

对于长表格，需要滚动才能查看表头和滚动条，那么现在可以设置跟随页面固定表头和滚动条。

## en-US

For long table，need to scroll to view the header and scroll bar，then you can now set the fixed header and scroll bar to follow the page.

</docs>

<template>
  <a-table sticky :columns="columns" :data-source="data" :scroll="{ x: 1500 }">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'"><a>action</a></template>
    </template>
    <template #summary>
      <a-table-summary :fixed="fixedTop ? 'top' : 'bottom'">
        <a-table-summary-row>
          <a-table-summary-cell :index="0" :col-span="2">
            <a-switch
              v-model:checked="fixedTop"
              checked-children="Fixed Top"
              un-checked-children="Fixed Top"
            ></a-switch>
          </a-table-summary-cell>
          <a-table-summary-cell :index="2" :col-span="8">Scroll Context</a-table-summary-cell>
          <a-table-summary-cell :index="10">Fix Right</a-table-summary-cell>
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>

<script lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const columns = ref<TableColumnsType>([
      {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
      },
      {
        title: 'Age',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        fixed: 'left',
      },
      {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width: 150,
      },
      {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width: 150,
      },
      {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
        width: 150,
      },
      {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
        width: 150,
      },
      {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
        width: 150,
      },
      {
        title: 'Column 6',
        dataIndex: 'address',
        key: '6',
        width: 150,
      },
      {
        title: 'Column 7',
        dataIndex: 'address',
        key: '7',
        width: 150,
      },
      { title: 'Column 8', dataIndex: 'address', key: '8' },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
      },
    ]);

    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    return {
      data,
      columns,
      fixedTop: ref(false),
    };
  },
});
</script>

<style>
#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme='dark'] #components-table-demo-summary tfoot th,
[data-theme='dark'] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
</style>
