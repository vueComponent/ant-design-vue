<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The simplest usage.

</docs>

<template>
  <a-affix :offset-top="top">
    <a-button type="primary" @click="top += 10">Affix top</a-button>
  </a-affix>
  <br />
  <a-affix :offset-bottom="bottom">
    <a-button type="primary" @click="bottom += 10">Affix bottom</a-button>
  </a-affix>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const top = ref<number>(10);
    const bottom = ref<number>(10);
    return {
      top,
      bottom,
    };
  },
});
</script>
