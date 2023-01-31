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
    <a-tag v-if="!!value" color="blue" :key="key">
      {{ key }}
    </a-tag>
  </template>
</template>
<script>
import { defineComponent } from 'vue';
import { Grid } from 'ant-design-vue';

const useBreakpoint = Grid.useBreakpoint;

export default defineComponent({
  setup() {
    const screens = useBreakpoint();
    return {
      screens,
    };
  },
});
</script>
