<docs>
---
order: 1
title:
  zh-CN: 更多
  en-US: More
---

## zh-CN

更多分页。

## en-US

More pages.
</docs>

<template>
  <a-pagination v-model:current="current" :total="500" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const current = ref(6);
</script>
