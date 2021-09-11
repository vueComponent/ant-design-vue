<docs>
---
order: 16
title:
  zh-CN: 可控的筛选和排序
  en-US: Reset filters and sorters

---

## zh-CN

使用受控属性对筛选和排序状态进行控制。
> 1. columns 中定义了 filteredValue 和 sortOrder 属性即视为受控模式。
> 2. 只支持同时对一列进行排序，请保证只有一列的 sortOrder 属性是生效的。
> 3. 务必指定 `column.key`。

## en-US

Control filters and sorters by `filteredValue` and `sortOrder`.
> 1. Defining `filteredValue` or `sortOrder` means that it is in the controlled mode.
> 2. Make sure `sortOrder` is assigned for only one column.
> 3. `column.key` is required.

</docs>

<template>
  <div>
    <div class="table-operations">
      <a-button @click="setAgeSort">Sort age</a-button>
      <a-button @click="clearFilters">Clear filters</a-button>
      <a-button @click="clearAll">Clear filters and sorters</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" @change="handleChange" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';

interface DataItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataItem[] = [
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

export default defineComponent({
  setup() {
    const filteredInfo = ref();
    const sortedInfo = ref();

    const columns = computed<TableColumnType[]>(() => {
      const filtered = filteredInfo.value || {};
      const sorted = sortedInfo.value || {};
      return [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          filters: [
            { text: 'Joe', value: 'Joe' },
            { text: 'Jim', value: 'Jim' },
          ],
          filteredValue: filtered.name || null,
          onFilter: (value: string, record: DataItem) => record.name.includes(value),
          sorter: (a: DataItem, b: DataItem) => a.name.length - b.name.length,
          sortOrder: sorted.columnKey === 'name' && sorted.order,
          ellipsis: true,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          sorter: (a: DataItem, b: DataItem) => a.age - b.age,
          sortOrder: sorted.columnKey === 'age' && sorted.order,
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
          filters: [
            { text: 'London', value: 'London' },
            { text: 'New York', value: 'New York' },
          ],
          filteredValue: filtered.address || null,
          onFilter: (value: string, record: DataItem) => record.address.includes(value),
          sorter: (a: DataItem, b: DataItem) => a.address.length - b.address.length,
          sortOrder: sorted.columnKey === 'address' && sorted.order,
          ellipsis: true,
        },
      ];
    });

    const handleChange: TableProps['onChange'] = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      filteredInfo.value = filters;
      sortedInfo.value = sorter;
    };
    const clearFilters = () => {
      filteredInfo.value = null;
    };
    const clearAll = () => {
      filteredInfo.value = null;
      sortedInfo.value = null;
    };
    const setAgeSort = () => {
      sortedInfo.value = {
        order: 'descend',
        columnKey: 'age',
      };
    };

    return {
      data,
      columns,
      handleChange,
      clearFilters,
      clearAll,
      setAgeSort,
    };
  },
});
</script>
<style scoped>
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
</style>
