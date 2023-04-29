<docs>
---
order: 4
title:
  zh-CN: 加载中
  en-US: Loading
---

## zh-CN

标识开关操作仍在执行中。

## en-US

Mark a pending state of switch.

</docs>
<template>
  <div>
    <a-switch v-model:checked="state.checked1" loading />
    <br />
    <a-switch v-model:checked="state.checked2" size="small" loading />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const state = reactive({
  checked1: true,
  checked2: false,
});
</script>
