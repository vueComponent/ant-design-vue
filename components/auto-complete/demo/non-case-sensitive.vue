<docs>
---
order: 3
title:
  zh-CN: 不区分大小写
  en-US: Non-case-sensitive AutoComplete
---

## zh-CN

不区分大小写的 AutoComplete。

## en-US

A non-case-sensitive AutoComplete.
</docs>

<template>
  <a-auto-complete
    v-model:value="value"
    :options="options"
    style="width: 200px"
    placeholder="input here"
    :filter-option="filterOption"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
interface Option {
  value: string;
}
export default defineComponent({
  setup() {
    const filterOption = (input: string, option: Option) => {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    };
    return {
      value: ref(''),
      options: ref<Option[]>([
        { value: 'Burns Bay Road' },
        { value: 'Downing Street' },
        { value: 'Wall Street' },
      ]),
      filterOption,
    };
  },
});
</script>
