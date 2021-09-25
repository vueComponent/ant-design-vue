<docs>
---
order: 2
title:
  zh-CN: 从数据直接生成
  en-US: Generate form tree data
---

## zh-CN

使用 `treeData` 把 JSON 数据直接生成树结构。

## en-US

The tree structure can be populated using `treeData` property. This is a quick and easy way to provide the tree content.

</docs>
<template>
  <a-tree-select
    v-model:value="value"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="Please select"
    tree-default-expand-all
  >
    <template #title="{ key, value: val, title }">
      <span v-if="key === '0-0-1'" style="color: #08c">Child Node1 {{ val }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree-select>
</template>

<script lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

const treeData: TreeSelectProps['treeData'] = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  },
];
export default defineComponent({
  setup() {
    const value = ref<string>();

    watch(value, () => {
      console.log(value.value);
    });
    return {
      value,
      treeData,
    };
  },
});
</script>
