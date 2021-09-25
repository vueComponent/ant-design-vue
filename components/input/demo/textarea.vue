<docs>
---
order: 7
title:
  zh-CN: 文本域
  en-US: TextArea
---

## zh-CN

用于多行输入。

## en-US

For multi-line input.

</docs>
<template>
  <a-textarea v-model:value="value" placeholder="Basic usage" :rows="4" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>('');
    return {
      value,
    };
  },
});
</script>
