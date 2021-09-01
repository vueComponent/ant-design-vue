<docs>
---
order: 7
title:
  zh-CN: 目录
  en-US: Directory
---

## zh-CN

内置的目录树，`multiple` 模式支持 `ctrl(Windows)` / `command(Mac)` 复选。

## en-US

Built-in directory tree. `multiple` support `ctrl(Windows)` / `command(Mac)` selection.

</docs>

<template>
  <a-directory-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    multiple
    :tree-data="treeData"
  >
  </a-directory-tree>
</template>
<script lang="ts">
import type { TreeProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const expandedKeys = ref<string[]>(['0-0', '0-1']);
    const selectedKeys = ref<string[]>([]);
    const treeData: TreeProps['treeData'] = [
      {
        title: 'parent 0',
        key: '0-0',
        children: [
          {
            title: 'leaf 0-0',
            key: '0-0-0',
            isLeaf: true,
          },
          {
            title: 'leaf 0-1',
            key: '0-0-1',
            isLeaf: true,
          },
        ],
      },
      {
        title: 'parent 1',
        key: '0-1',
        children: [
          {
            title: 'leaf 1-0',
            key: '0-1-0',
            isLeaf: true,
          },
          {
            title: 'leaf 1-1',
            key: '0-1-1',
            isLeaf: true,
          },
        ],
      },
    ];
    return {
      expandedKeys,
      selectedKeys,
      treeData,
    };
  },
});
</script>
