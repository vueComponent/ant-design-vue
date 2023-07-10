<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic Usage
---

## zh-CN

最简单的用法。

## en-US

The simplest usage.
</docs>

<template>
  <a-color-picker v-model:value="color" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const color = ref('#1677FF');
</script>
