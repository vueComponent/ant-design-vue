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
  <a-tree-select
    v-model:value="checkedKeys"
    style="width: 100%"
    tree-checkable
    tree-default-expand-all
    :show-checked-strategy="SHOW_PARENT"
    :height="233"
    :tree-data="treeData"
    :max-tag-count="10"
  >
    <template #title="{ title, value }">
      <span v-if="value === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree-select>
</template>
<script lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import { TreeSelect } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

function dig(path = '0', level = 3) {
  const list: TreeSelectProps['treeData'] = [];
  for (let i = 0; i < 10; i += 1) {
    const value = `${path}-${i}`;
    const treeNode: TreeSelectProps['treeData'][number] = {
      title: value,
      value,
    };

    if (level > 0) {
      treeNode.children = dig(value, level - 1);
    }

    list.push(treeNode);
  }
  return list;
}

export default defineComponent({
  setup() {
    const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys);
    });

    return {
      treeData: dig(),
      checkedKeys,
      SHOW_PARENT,
    };
  },
});
</script>
