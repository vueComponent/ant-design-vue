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
  ></a-tree-select>
</template>
<script lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  setup() {
    const value = ref<string[]>([]);
    const treeData = ref<TreeSelectProps['treeData']>([
      {
        title: 'parent 1',
        value: 'parent 1',
        children: [
          {
            title: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                title: 'my leaf',
                value: 'leaf1',
              },
              {
                title: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            title: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
    ]);
    watch(value, () => {
      console.log('select', value.value);
    });

    return {
      value,
      treeData,
    };
  },
});
</script>
