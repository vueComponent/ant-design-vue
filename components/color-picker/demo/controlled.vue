<docs>
---
order: 3
title:
  zh-CN: 受控模式
  en-US: Controlled
---
## zh-CN

通过 `value` 和 `onChange` 设置组件为受控模式。

## en-US

Set the component to controlled mode.

</docs>

<template>
  <a-color-picker :value="color" @change="handleChange" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const color = ref('#1677FF');
const handleChange = newColor => {
  color.value = newColor;
};
</script>
