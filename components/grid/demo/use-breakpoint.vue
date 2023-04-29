<docs>
---
order: 10
title:
  zh-CN: useBreakpoint Hook
  en-US: useBreakpoint Hook
---

## zh-CN

使用 `useBreakpoint` 个性化布局。

## en-US

Use `useBreakpoint` Hook provide personalized layout.

</docs>

<template>
  Current break point:
  <template v-for="(value, key) in screens">
    <a-tag v-if="!!value" :key="key" color="blue">
      {{ key }}
    </a-tag>
  </template>
</template>
<script lang="ts" setup>
import { Grid } from 'ant-design-vue';

const useBreakpoint = Grid.useBreakpoint;
const screens = useBreakpoint();
</script>
