<template>
  <a-directory-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    multiple
    :tree-data1="treeData"
  >
    <a-tree-node key="0-0" title="ddd" class="test" style="color: red">
      <template #title="{ title }">{{ title }}</template>
      <a-tree-node key="0-0-0" title="leaf 0-0" is-leaf />
      <a-tree-node key="0-0-1" title="leaf 0-1" is-leaf />
    </a-tree-node>
    <a-tree-node key="0-1" title="parent 1">
      <a-tree-node key="0-1-0" title="leaf 1-0" is-leaf />
      <a-tree-node key="0-1-1" title="leaf 1-1" is-leaf />
    </a-tree-node>
  </a-directory-tree>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    const expandedKeys = ref<string[]>([]);
    const selectedKeys = ref<string[]>([]);
    const treeData = [
      {
        title: 'parent 0',
        key: '0-0',
        children: [
          { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
          // { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
        ],
      },
      {
        title: 'parent 1',
        key: '0-1',
        children: [
          { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
          { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
        ],
      },
    ];
    return {
      expandedKeys,
      selectedKeys,
      onTest: () => {},
      treeData,
    };
  },
});
</script>
