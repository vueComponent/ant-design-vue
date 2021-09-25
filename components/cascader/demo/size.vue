<docs>
---
order: 6
title:
  zh-CN: 大小
  en-US: Size
---

## zh-CN

不同大小的级联选择器。

## en-US

Cascade selection box of different sizes.

</docs>
<template>
  <a-cascader v-model:value="value" size="large" :options="options" />
  <br />
  <br />
  <a-cascader v-model:value="value" :options="options" />
  <br />
  <br />
  <a-cascader v-model:value="value" size="small" :options="options" />
  <br />
  <br />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
interface Option {
  value: string;
  label: string;
  children?: Option[];
}
const options: Option[] = [
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
