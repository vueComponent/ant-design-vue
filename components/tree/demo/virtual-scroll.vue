<docs>
---
order: 9
title:
  zh-CN: 虚拟滚动
  en-US: Virtual scroll
---

## zh-CN

使用 `height` 属性则切换为虚拟滚动。

## en-US

Use virtual list through `height` prop.

</docs>
<template>
  <a-tree
    v-model:selectedKeys="selectedKeys"
    v-model:checkedKeys="checkedKeys"
    default-expand-all
    checkable
    :height="233"
    :tree-data="treeData"
  >
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>
<script lang="ts">
import type { TreeProps } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

function dig(path = '0', level = 3) {
  const list: TreeProps['treeData'] = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: TreeProps['treeData'][number] = {
      title: key,
      key,
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    }

    list.push(treeNode);
  }
  return list;
}

export default defineComponent({
  setup() {
    const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
    });
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys);
    });

    return {
      treeData: dig(),
      selectedKeys,
      checkedKeys,
    };
  },
});
</script>
