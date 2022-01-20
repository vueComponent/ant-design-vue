<docs>
---
order: 3
title:
  zh-CN: 移入展开
  en-US: Hover
---

## zh-CN

通过移入展开下级菜单，点击完成选择。

## en-US

Hover to expand sub menu, click to select option.

</docs>
<template>
  <a-cascader
    v-model:value="value"
    :options="options"
    expand-trigger="hover"
    placeholder="Please select"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { CascaderProps } from 'ant-design-vue';
const options: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
export default defineComponent({
  setup() {
    return {
      value: ref<string[]>([]),
      options,
    };
  },
});
</script>
