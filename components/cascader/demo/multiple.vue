<docs>
---
order: 5.1
version: 3.0.0
title:
  zh-CN: 多选
  en-US: Multiple
---

## zh-CN

一次性选择多个选项。

## en-US

Select multiple options
</docs>
<template>
  <a-space direction="vertical" style="width: 100%">
    <h4>Cascader.SHOW_PARENT</h4>
    <a-cascader
      v-model:value="value"
      style="width: 100%"
      multiple
      max-tag-count="responsive"
      :options="options"
      placeholder="Please select"
    ></a-cascader>
    <h4>Cascader.SHOW_CHILD</h4>
    <a-cascader
      v-model:value="value"
      style="width: 100%"
      multiple
      max-tag-count="responsive"
      :options="options"
      placeholder="Please select"
      :show-checked-strategy="Cascader.SHOW_CHILD"
    ></a-cascader>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from 'ant-design-vue';
import { Cascader } from 'ant-design-vue';
const options: CascaderProps['options'] = [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

const value = ref<string[]>([]);
</script>
