<docs>
---
order: 2
title:
  zh-CN: 可以自定义显示
  en-US: Custom trigger
---

## zh-CN

切换按钮和结果分开。

## en-US

Separate trigger button and result.

</docs>
<template>
  <span>
    {{ text }} &nbsp;
    <a-cascader v-model:value="value" :options="options" @change="onChange">
      <a href="#">Change city</a>
    </a-cascader>
  </span>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
interface Option {
  value: string;
  label: string;
  children?: Option[];
  code?: number;
  [key: string]: any;
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
    const value = ref<string[]>([]);
    const text = ref<string>('Unselect');

    const onChange = (value: string, selectedOptions: Option[]) => {
      text.value = selectedOptions.map(o => o.label).join(', ');
    };

    return {
      value,
      text,
      options,
      onChange,
    };
  },
});
</script>
