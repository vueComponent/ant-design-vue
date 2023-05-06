<docs>
---
order: 7
title:
  zh-CN: 单选组合
  en-US: Radio Group
---

## zh-CN

一组互斥的 Radio 配合使用。

## en-US

A group of radio components.

</docs>
<template>
  <div>
    <a-radio-group v-model:value="value">
      <a-radio :value="1">A</a-radio>
      <a-radio :value="2">B</a-radio>
      <a-radio :value="3">C</a-radio>
      <a-radio :value="4">D</a-radio>
    </a-radio-group>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(1);
</script>
