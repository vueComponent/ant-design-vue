<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic Usage
---

## zh-CN

基本使用。通过 options 设置自动完成的数据源。

## en-US

Basic Usage, set datasource of autocomplete with `options` property.
</docs>

<template>
  <a-auto-complete
    v-model:value="value"
    :options="options"
    style="width: 200px"
    placeholder="input here"
    @select="onSelect"
    @search="onSearch"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface MockVal {
  value: string;
}
const mockVal = (str: string, repeat = 1): MockVal => {
  return {
    value: str.repeat(repeat),
  };
};
const value = ref('');
const options = ref<MockVal[]>([]);
const onSearch = (searchText: string) => {
  console.log('searchText');
  options.value = !searchText
    ? []
    : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
};
const onSelect = (value: string) => {
  console.log('onSelect', value);
};
watch(value, () => {
  console.log('value', value.value);
});
</script>
