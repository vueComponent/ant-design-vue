<docs>
---
order: 28
title:
  zh-CN: 弹出位置
  en-US: Popup Placement
---

## zh-CN

可以通过 `placement` 手动指定弹出的位置。

## en-US

You can manually specify the position of the popup via `placement`.

</docs>

<template>
  <a-radio-group v-model:value="placement">
    <a-radio-button value="topLeft">topLeft</a-radio-button>
    <a-radio-button value="topRight">topRight</a-radio-button>
    <a-radio-button value="bottomLeft">bottomLeft</a-radio-button>
    <a-radio-button value="bottomRight">bottomRight</a-radio-button>
  </a-radio-group>
  <br />
  <br />
  <a-tree-select
    v-model:value="value"
    show-search
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto', minWidth: '300px' }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    :placement="placement"
    :dropdown-match-select-width="false"
  >
    <template #title="{ value: val, title }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree-select>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { TreeSelectProps } from 'ant-design-vue';
export default defineComponent({
  setup() {
    const placement = ref('topLeft' as const);
    const value = ref<string>();
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
    return {
      placement,
      value,
      treeData,
    };
  },
});
</script>
