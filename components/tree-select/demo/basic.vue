<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

最简单的用法。

## en-US

The most basic usage.

</docs>

<template>
  <a-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    tree-node-filter-prop="label"
  >
    <template #title="{ value: val, label }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>{{ label }}</template>
    </template>
  </a-tree-select>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { TreeSelectProps } from 'ant-design-vue';
const value = ref<string>();
const treeData = ref<TreeSelectProps['treeData']>([
  {
    label: 'root 1',
    value: 'root 1',
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
        label: 'parent 2',
        value: 'parent 2',
      },
    ],
  },
]);
watch(value, () => {
  console.log(value.value);
});
</script>
