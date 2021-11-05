<docs>
---
order: 0
title:
  zh-CN: 手风琴模式
  en-US: Accordion
---

## zh-CN

同一级的节点，每次只能展开一个

## en-US

Nodes of the same level can only be expanded one

</docs>
<template>
  <a-tree
    v-model:selectedKeys="selectedKeys"
    :expanded-keys="expandedKeys"
    :tree-data="treeData"
    @expand="handleExpand"
  >
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>
<script lang="ts">
import type { TreeProps } from 'ant-design-vue';
import _ from 'lodash';
import { defineComponent, ref, watch } from 'vue';

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ key: '0-0-1-0', title: 'sss' }],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '1-0',
    children: [
      {
        title: 'parent 2-0',
        key: '1-0-0',
      },
      {
        title: 'parent 2-1',
        key: '2-0-1',
      },
    ],
  },
];

export default defineComponent({
  setup() {
    const expandedKeys = ref<string[]>([]);
    const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    watch(expandedKeys, () => {
      console.log('expandedKeys', expandedKeys);
    });
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
    });
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys);
    });
    const handleExpand = (keys: string[], { expanded, node }) => {
      // node.parent add from 3.0.0-alpha.10
      const tempKeys = ((node.parent ? node.parent.children : treeData) || []).map(
        ({ key }) => key,
      );
      if (expanded) {
        expandedKeys.value = _.difference(keys, tempKeys).concat(node.key);
      } else {
        expandedKeys.value = keys;
      }
    };
    return {
      treeData,
      expandedKeys,
      selectedKeys,
      checkedKeys,
      handleExpand,
    };
  },
});
</script>
