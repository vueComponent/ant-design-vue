<docs>
---
order: 1
title:
  zh-CN: 带输入框的滑块
  en-US: Slider with InputNumber
---

## zh-CN

和 [数字输入框](/components/input-number/) 组件保持同步。

## en-US

Synchronize with [InputNumber](/components/input-number/) component.
</docs>

<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-slider v-model:value="inputValue1" :min="1" :max="20" />
      </a-col>
      <a-col :span="4">
        <a-input-number v-model:value="inputValue1" :min="1" :max="20" style="margin-left: 16px" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-slider v-model:value="inputValue" :min="0" :max="1" :step="0.01" />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model:value="inputValue"
          :min="0"
          :max="1"
          :step="0.01"
          style="margin-left: 16px"
        />
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const inputValue = ref<number>(0);
const inputValue1 = ref<number>(1);
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
