<docs>
---
order: 7
title:
  zh-CN: 文本域
  en-US: TextArea
---

## zh-CN

用于多行输入。

## en-US

For multi-line input.

</docs>
<template>
  <a-textarea v-model:value="value" placeholder="Basic usage" :rows="4" />
  <br />
  <br />
  <a-textarea :rows="4" placeholder="maxlength is 6" :maxlength="6" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
</script>
