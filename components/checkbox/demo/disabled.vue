<docs>
---
order: 3
title:
  zh-CN: 不可用
  en-US: Disabled
---

## zh-CN

checkbox 不可用

## en-US

Disabled checkbox

</docs>

<template>
  <a-checkbox v-model:checked="checked1" disabled />
  <br />
  <a-checkbox v-model:checked="checked2" disabled />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      checked1: ref(false),
      checked2: ref(false),
    };
  },
});
</script>
