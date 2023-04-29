<docs>
---
order: 0
title:
  zh-CN: 无边框
  en-US: Borderless
---

## zh-CN

没有边框。

## en-US

No border.

</docs>
<template>
  <a-input v-model:value="value" :bordered="false" placeholder="Borderless" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
</script>
