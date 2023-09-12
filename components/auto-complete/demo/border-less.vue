<docs>
---
order: 7
title:
  zh-CN: 无边框
  en-US: Border less
---

## zh-CN

没有边框。

## en-US

border less.
</docs>

<template>
  <a-auto-complete
    v-model:value="value"
    :options="options"
    style="width: 200px"
    placeholder="border less"
    :bordered="false"
    @select="onSelect"
    @search="onSearch"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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
</script>
