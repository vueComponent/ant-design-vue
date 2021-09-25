<docs>
---
order: 7
title:
  zh-CN: 自定义已选项
  en-US: Custom render
---

## zh-CN

例如给最后一项加上邮编链接。

## en-US

For instance, add an external link after the selected value.

</docs>
<template>
  <a-cascader v-model:value="value" :options="options" style="width: 100%">
    <template #displayRender="{ labels, selectedOptions }">
      <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
        <span v-if="index === labels.length - 1">
          {{ label }} (
          <a @click="e => handleAreaClick(e, label, selectedOptions[index])">
            {{ selectedOptions[index].code }}
          </a>
          )
        </span>
        <span v-else>{{ label }} /</span>
      </span>
    </template>
  </a-cascader>
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
            code: 752100,
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
            code: 453400,
          },
        ],
      },
    ],
  },
];
export default defineComponent({
  setup() {
    const handleAreaClick = (e: Event, label: string, option: Option) => {
      e.stopPropagation();
      console.log('clicked', label, option);
    };

    return {
      value: ref<string[]>(['zhejiang', 'hangzhou', 'xihu']),
      options,
      handleAreaClick,
    };
  },
});
</script>
