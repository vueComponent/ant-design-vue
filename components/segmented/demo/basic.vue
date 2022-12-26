<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic Usage
---

## zh-CN

最简单的用法。

## en-US
The most basic usage.
</docs>

<template>
  <a-segmented :options="data" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const data = reactive(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']);
    return {
      data,
    };
  },
});
</script>
