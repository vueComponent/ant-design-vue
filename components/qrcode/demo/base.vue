<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Base
---

## zh-CN

基本用法。

## en-US
Basic Usage.
</docs>

<template>
  <a-space direction="vertical" align="center">
    <a-qrcode :value="text" />
    <a-input v-model:value="text" placeholder="-" :maxlength="60" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const text = ref('https://www.antdv.com/');
</script>
