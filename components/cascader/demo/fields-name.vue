<docs>
---
order: 10
title:
  zh-CN: 自定义字段名
  en-US: Custom Field Names
---

## zh-CN

自定义字段名。

## en-US

Custom Field Names

</docs>
<template>
  <a-cascader
    v-model:value="value"
    :field-names="{ label: 'name', value: 'code', children: 'items' }"
    :options="options"
    placeholder="Please select"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
interface Option {
  code: string;
  name: string;
  disabled?: boolean;
  items?: Option[];
  [key: string]: any;
}
const options: Option[] = [
  {
    code: 'zhejiang',
    name: 'Zhejiang',
    items: [
      {
        code: 'hangzhou',
        name: 'Hangzhou',
        items: [
          {
            code: 'xihu',
            name: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    code: 'jiangsu',
    name: 'Jiangsu',
    items: [
      {
        code: 'nanjing',
        name: 'Nanjing',
        items: [
          {
            code: 'zhonghuamen',
            name: 'Zhong Hua Men',
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
