<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic Usage
---

## zh-CN

最简单的用法。

## en-US
The most basic usage.
</docs>

<template>
  <a-segmented v-model:value="value" :options="data" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const data = reactive(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']);
const value = ref(data[0]);
</script>
