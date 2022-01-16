<docs>
---
order: 6
title:
  zh-CN: 线性样式
  en-US: Show Tree Line
---

## zh-CN

通过 `treeLine` 配置线性样式。

## en-US

Use `treeLine` to show the line style.

</docs>

<template>
  <a-space direction="vertical">
    <a-switch
      v-model:checked="treeLine"
      checked-children="treeLine"
      un-checked-children="treeLine"
    ></a-switch>
    <a-switch
      v-model:checked="showLeafIcon"
      :disabled="!treeLine"
      checked-children="showLeafIcon"
      un-checked-children="showLeafIcon"
    ></a-switch>
    <a-tree-select
      v-model:value="value"
      style="width: 300px"
      placeholder="Please select"
      :tree-line="treeLine && { showLeafIcon }"
      :tree-data="treeData"
    >
      <template #title="{ value: val, title }">
        <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
        <template v-else>{{ title }}</template>
      </template>
    </a-tree-select>
  </a-space>
</template>
<script lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    const treeLine = ref(true);
    const showLeafIcon = ref(false);
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
    watch(value, () => {
      console.log(value.value);
    });
    return {
      treeLine,
      showLeafIcon,
      value,
      treeData,
    };
  },
});
</script>
