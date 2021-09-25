<docs>
---
order: 12
title:
  zh-CN: 带字数提示的文本域
  en-US: Textarea with character counting
---

## zh-CN

展示字数提示。

## en-US

Show character counting.

</docs>
<template>
  <a-textarea v-model:value="value" show-count :maxlength="100" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>('test value');
    return {
      value,
    };
  },
});
</script>
