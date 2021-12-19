<docs>
---
order: 6
title:
  zh-CN: 超出边界
  en-US: Out of range
---

## zh-CN

当通过受控将 `value` 超出边界时，提供警告样式。

## en-US

Show warning style when `value` is out of range by control.

</docs>

<template>
  <a-space>
    <a-input-number v-model:value="value" :min="1" :max="10" />
    <a-button type="primary" @click="value = 99">Reset</a-button>
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<number>(99);

    return {
      value,
    };
  },
});
</script>
