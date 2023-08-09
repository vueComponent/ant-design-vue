<docs>
---
order: 8
title:
  zh-CN: 自定义清除按钮
  en-US: Customize clear button
---

## zh-CN

自定义清除按钮。

## en-US

Customize clear button.
</docs>

<template>
  <a-auto-complete
    v-model:value="value"
    :options="options"
    style="width: 200px"
    placeholder="Clearable"
    :allow-clear="true"
    @select="onSelect"
    @search="onSearch"
  />
  <br />
  <br />
  <a-auto-complete
    v-model:value="value"
    :options="options"
    style="width: 200px"
    placeholder="Customized clear icon"
    :allow-clear="true"
    @select="onSelect"
    @search="onSearch"
  >
    <template #clearIcon>
      <close-outlined />
    </template>
  </a-auto-complete>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';

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
