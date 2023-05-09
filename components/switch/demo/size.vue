<docs>
---
order: 3
title:
  zh-CN: 两种大小
  en-US: Two sizes
---

## zh-CN

`size="small"` 表示小号开关。

## en-US

`size="small"` represents a small sized switch.

</docs>

<template>
  <a-space direction="vertical">
    <a-switch v-model:checked="state.checked1" />
    <a-switch v-model:checked="state.checked2" size="small" />
  </a-space>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const state = reactive({
  checked1: true,
  checked2: false,
});
</script>
