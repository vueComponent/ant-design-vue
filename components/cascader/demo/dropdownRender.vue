<docs>
---
order: 11
title:
  zh-CN: 扩展菜单
  en-US: Custom dropdown
---

## zh-CN

使用 dropdownRender 对下拉菜单进行自由扩展。

## en-US

Customize the dropdown menu via dropdownRender.

</docs>
<template>
  <a-cascader v-model:value="value" :options="options" placeholder="Please select">
    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0" />
      <div style="padding: 8px">The footer is not very short.</div>
    </template>
  </a-cascader>
</template>
<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import type { CascaderProps } from 'ant-design-vue';

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});

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

const value = ref<string[]>([]);
</script>
