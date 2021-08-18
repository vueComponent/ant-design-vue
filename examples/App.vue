<template>
  <a-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    :load-data="onLoadData"
    :tree-data="treeData"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

export default defineComponent({
  setup() {
    const expandedKeys = ref<string[]>([]);
    const selectedKeys = ref<string[]>([]);
    const treeData = ref<TreeDataItem[]>([
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ]);
    const onLoadData = (treeNode: any) => {
      return new Promise((resolve: (value?: unknown) => void) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: 'Child Node', key: `${treeNode.eventKey}-0` },
            { title: 'Child Node', key: `${treeNode.eventKey}-1` },
          ];
          treeData.value = [...treeData.value];
          resolve();
        }, 1000);
      });
    };
    return {
      expandedKeys,
      selectedKeys,
      treeData,
      onLoadData,
    };
  },
});
</script>
