<docs>

---
order: 7
title:
  zh-CN: 颜色完成选择
  en-US: Color completed selection
---

## zh-CN

颜色选择完成才会触发回调

## en-US

The callback will be called only when the color selection is completed.

</docs>

<template>
  <a-color-picker :value="color" @changeComplete="handleChangeComplete" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
const color = ref('#1677FF');
const handleChangeComplete = newColor => {
  message.success(`change color to ${newColor.toHexString()}`);
  color.value = newColor;
};
</script>
