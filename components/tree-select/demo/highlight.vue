<docs>
---
order: 0
title:
  zh-CN: 高亮
  en-US: Highlight
---

## zh-CN

搜索值高亮

## en-US

Search Value Hightlight

</docs>

<template>
  <a-tree-select
    v-model:value="value"
    v-model:searchValue="searchValue"
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
      <template v-else>
        <template
          v-for="(fragment, i) in label
            .toString()
            .split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
        >
          <span
            v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
            :key="i"
            style="color: #08c"
          >
            {{ fragment }}
          </span>
          <template v-else>{{ fragment }}</template>
        </template>
      </template>
    </template>
  </a-tree-select>
</template>
<script lang="ts" setup>
import type { TreeSelectProps } from 'ant-design-vue';
import { ref, watch } from 'vue';
const value = ref<string>();
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
  console.log(value.value);
});
const searchValue = ref('');
</script>
