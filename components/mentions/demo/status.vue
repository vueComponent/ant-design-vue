<docs>
---
order: 8
title:
  zh-CN: 自定义状态
  en-US: Status
---

## zh-CN

使用 `status` 为 Mentions 添加状态。可选 `error` 或者 `warning`。

## en-US

Add status to Mentions with `status`, which could be `error` or `warning`。

</docs>
<template>
  <a-space direction="vertical">
    <a-mentions
      v-model:value="value"
      :options="options"
      autofocus
      status="error"
      @select="onSelect"
    ></a-mentions>
    <a-mentions
      v-model:value="value"
      :options="options"
      autofocus
      status="warning"
      @select="onSelect"
    ></a-mentions>
  </a-space>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const value = ref<string>('@afc163');
watch(value, () => {
  console.log('value', value);
});
const onSelect = (option: { value: string }) => {
  console.log('select', option);
};

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
