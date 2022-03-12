<docs>
---
order: 12
title:
  zh-CN: 带字数提示
  en-US: With character counting
---

## zh-CN

展示字数提示。

## en-US

Show character counting.

</docs>
<template>
  <a-input v-model:value="value1" show-count :maxlength="20" />
  <br />
  <br />
  <a-textarea v-model:value="value2" show-count :maxlength="100" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value1 = ref<string>('test value');
    const value2 = ref<string>('test value');
    return {
      value1,
      value2,
    };
  },
});
</script>
