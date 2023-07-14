<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

基本用法。

## en-US

Basic usage example.

</docs>
<template>
  <a-space direction="vertical">
    <a-input v-model:value="value" placeholder="Basic usage" />
    <a-input v-model:value.lazy="value1" autofocus placeholder="Lazy usage" />
  </a-space>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue';
const value = ref<string>('');
const value1 = ref<string>('');
watch(value, () => {
  console.log(value.value);
});
watch(value1, () => {
  console.log(value1.value);
});
</script>
