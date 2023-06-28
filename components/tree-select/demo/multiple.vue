<docs>
---
order: 1
title:
  zh-CN: 多选
  en-US: Multiple Selection
---

## zh-CN

多选的树选择。

## en-US

Multiple selection usage.

</docs>

<template>
  <a-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    multiple
    tree-default-expand-all
    :tree-data="treeData"
    tree-node-filter-prop="label"
  >
    <template #title="{ value: val, label }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">{{ val }}</b>
      <template v-else>{{ label }}</template>
    </template>
  </a-tree-select>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { TreeSelectProps } from 'ant-design-vue';

const value = ref<string[]>([]);
const treeData = ref<TreeSelectProps['treeData']>([
  {
    label: 'parent 1',
    value: 'parent 1',
    children: [
      {
        label: 'parent 1',
        value: 'parent 1',
        children: [
          {
            label: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                label: 'my leaf',
                value: 'leaf1',
              },
              {
                label: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            label: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
      {
        label: 'parent 1-1',
        value: 'parent 1-1',
      },
    ],
  },
]);
watch(value, () => {
  console.log('select', value.value);
});
</script>
