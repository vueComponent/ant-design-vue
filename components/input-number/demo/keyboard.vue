<docs>
---
order: 5
title:
  zh-CN: 键盘行为
  en-US: Keyboard
---

## zh-CN

使用 `keyboard` 属性可以控制键盘行为。

## en-US

Control keyboard behavior by `keyboard`.
</docs>

<template>
  <a-space>
    <a-input-number v-model:value="value" :keyboard="keyboard" :min="1" :max="10" />
    <a-checkbox v-model:checked="keyboard">Toggle keyboard</a-checkbox>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
const keyboard = ref(true);
</script>
