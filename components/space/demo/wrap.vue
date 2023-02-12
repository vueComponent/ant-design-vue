<docs>
---
order: 0
title:
  zh-CN: 自动换行
  en-US: Basic Usage
---

## zh-CN

自动换行。

## en-US

Wrap

</docs>

<template>
  <a-space :size="[8, 16]" wrap>
    <template v-for="index in 20" :key="index">
      <a-button>Button</a-button>
    </template>
  </a-space>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
