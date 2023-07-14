<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

数字输入框。

## en-US

Numeric-only input box.

</docs>

<template>
  <div>
    <a-input-number id="inputNumber" v-model:value="value" :min="1" :max="10" />
    当前值：{{ value }}
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
</script>
