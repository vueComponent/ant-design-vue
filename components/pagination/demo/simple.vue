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
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const current = ref<number>(2);
    return {
      current,
    };
  },
});
</script>
