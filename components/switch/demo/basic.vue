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
  <a-switch v-model:checked="checked" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const checked = ref<boolean>(false);
    return {
      checked,
    };
  },
});
</script>
