<docs>
---
order: 4
title:
  zh-CN: RadioGroup 垂直
  en-US: Vertical RadioGroup
---

## zh-CN

垂直的 RadioGroup，配合更多输入框选项。

## en-US

Vertical RadioGroup, with more radios.

</docs>
<template>
  <a-radio-group v-model:value="value">
    <a-radio :style="radioStyle" :value="1">Option A</a-radio>
    <a-radio :style="radioStyle" :value="2">Option B</a-radio>
    <a-radio :style="radioStyle" :value="3">Option C</a-radio>
    <a-radio :style="radioStyle" :value="4">
      More...
      <a-input v-if="value === 4" style="width: 100px; margin-left: 10px" />
    </a-radio>
  </a-radio-group>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
const value = ref<number>(1);
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
</script>
