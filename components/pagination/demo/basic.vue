<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础分页。

## en-US

Basic pagination.

</docs>

<template>
  <a-pagination v-model:current="current" :total="50" show-less-items />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref(2);
</script>
