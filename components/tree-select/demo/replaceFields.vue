<docs>
---
order: 9
title:
  zh-CN: 自定义字段
  en-US: ReplaceFields
---

## zh-CN

fieldNames 替换 treeNode中 title,key,children 字段为treeData中对应的字段

## en-US

Replace the title,key and children fields in treeNode with the corresponding fields in treeData.

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
    :field-names="{
      children: 'children',
      label: 'name',
      value: 'value',
    }"
  ></a-tree-select>
</template>
<script lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>();
    const treeData = ref<TreeSelectProps['treeData']>([
      {
        name: 'parent 1',
        value: 'parent 1',
        children: [
          {
            name: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                name: 'my leaf',
                value: 'leaf1',
              },
              {
                name: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            name: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
    ]);
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
