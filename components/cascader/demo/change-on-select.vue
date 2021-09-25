<docs>
---
order: 5
title:
  zh-CN: 选择即改变
  en-US: Change on select
---

## zh-CN

这种交互允许只选中父级选项。

## en-US

Allow only select parent options.

</docs>
<template>
  <a-cascader v-model:value="value" :options="options" change-on-select />
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
