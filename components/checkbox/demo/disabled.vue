<docs>
---
order: 3
title:
  zh-CN: 不可用
  en-US: Disabled
---

## zh-CN

checkbox 不可用

## en-US

Disabled checkbox

</docs>

<template>
  <a-checkbox v-model:checked="state.checked1" disabled />
  <br />
  <a-checkbox v-model:checked="state.checked2" disabled />
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
const state = reactive({
  checked1: false,
  checked2: true,
});
</script>
