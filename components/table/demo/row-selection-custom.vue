<docs>
---
order: 4
title:
  en-US: Custom selection
  zh-CN: 自定义选择项
---

## zh-CN
通过 `rowSelection.selections` 自定义选择项，默认不显示下拉选项，设为 `true` 时显示默认选择项。

## en-US
Use `rowSelection.selections` custom selections, default no select dropdown, show default selections via setting to `true`.

</docs>

<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="data" />
</template>
<script lang="ts">
import { defineComponent, computed, ref, unref } from 'vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';

type Key = ColumnProps['key'];

interface DataType {
  key: Key;
  name: string;
  age: number;
  address: string;
}

const columns = [
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

const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

export default defineComponent({
  setup() {
    const selectedRowKeys = ref<Key[]>([]); // Check here to configure the default column

    const onSelectChange = (changableRowKeys: Key[]) => {
      console.log('selectedRowKeys changed: ', changableRowKeys);
      selectedRowKeys.value = changableRowKeys;
    };

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'all-data',
            text: 'Select All Data',
            onSelect: () => {
              selectedRowKeys.value = [...Array(46).keys()]; // 0...45
            },
          },
          {
            key: 'odd',
            text: 'Select Odd Row',
            onSelect: (changableRowKeys: Key[]) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (index % 2 !== 0) {
                  return false;
                }
                return true;
              });
              selectedRowKeys.value = newSelectedRowKeys;
            },
          },
          {
            key: 'even',
            text: 'Select Even Row',
            onSelect: (changableRowKeys: Key[]) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (index % 2 !== 0) {
                  return true;
                }
                return false;
              });
              selectedRowKeys.value = newSelectedRowKeys;
            },
          },
        ],
      };
    });
    return {
      data,
      columns,
      selectedRowKeys,
      rowSelection,
    };
  },
});
</script>
