<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基本滑动条。当 `range` 为 `true` 时，渲染为双滑块。当 `disabled` 为 `true` 时，滑块处于不可用状态。

## en-US

Basic slider. When `range` is `true`, display as dual thumb mode. When `disable` is `true`, the slider will not be interactable.
</docs>

<template>
  <div>
    <a-slider id="test" v-model:value="value1" :disabled="disabled" />
    <a-slider v-model:value="value2" range :disabled="disabled" />
    Disabled:
    <a-switch v-model:checked="disabled" size="small" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(0);
const value2 = ref<[number, number]>([20, 50]);
const disabled = ref<boolean>(false);
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
