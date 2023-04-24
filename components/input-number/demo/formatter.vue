<docs>
---
order: 0
title:
  zh-CN: 格式化展示
  en-US: Formatter
---

## zh-CN

通过 `formatter` 格式化数字，以展示具有具体含义的数据，往往需要配合 `parser` 一起使用。

## en-US

Display value within it's situation with `formatter`, and we usually use `parser` at the same time.

</docs>

<template>
  <a-space>
    <a-input-number
      v-model:value="value1"
      :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
      :parser="value => value.replace(/\$\s?|(,*)/g, '')"
    />
    <a-input-number
      v-model:value="value2"
      :min="0"
      :max="100"
      :formatter="value => `${value}%`"
      :parser="value => value.replace('%', '')"
    />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(1000);
const value2 = ref<number>(100);
</script>
