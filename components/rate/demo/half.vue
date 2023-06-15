<docs>
---
order: 1
title:
  zh-CN: 半星
  en-US: Half star
---

## zh-CN

支持选中半星。

## en-US

Support select half star.

</docs>
<template>
  <a-rate v-model:value="value" allow-half />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(2.5);
</script>
