<docs>
---
order: 6
title:
  zh-CN: 简洁
  en-US: Simple mode
---

## zh-CN

简单的翻页。

## en-US

Simple mode.
</docs>
<template>
  <a-pagination v-model:current="current" simple :total="50" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(2);
</script>
