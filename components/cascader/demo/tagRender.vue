<docs>
---
order: 10
title:
  zh-CN: 自定义 tag 内容
  en-US: The custom tag
---

</docs>

<template>
  <a-cascader
    v-model:value="value"
    multiple
    :options="options"
    placeholder="Please select"
    suffix-icon="Shopping Around"
  >
    <template #tagRender="data">
      <a-tag :key="data.value" color="blue">{{ data.label }}</a-tag>
    </template>
  </a-cascader>
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
        value: 'freezeKey',
        label: 'freeze',
        children: [
          {
            value: 'key1',
            label: 'salmon',
          },
          {
            value: 'key2',
            label: 'beef',
          },
        ],
      },
      {
        value: 'fruitsKey',
        label: 'fruits',
        children: [
          {
            value: 'key11',
            label: 'apple',
          },
          {
            value: 'key22',
            label: 'banana',
          },
        ],
      },
    ],
  },
  {
    value: 'Chinese delicious food',
    label: '中国美食',
    children: [
      {
        value: 'key3',
        label: '月饼',
        children: [
          {
            value: 'key4',
            label: '蛋黄馅',
          },
          {
            value: 'key5',
            label: '五仁馅',
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
