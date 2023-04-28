<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

最简单的用法。

## en-US

The simplest usage.

</docs>
<template>
  <a-rate v-model:value="value" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(2);
</script>
