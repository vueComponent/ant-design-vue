<docs>
---
order: 1
title:
  zh-CN: 不可用
  en-US: Disabled
---

## zh-CN

Switch 失效状态。

## en-US

Disabled state of `Switch`.

</docs>

<template>
  <a-space direction="vertical">
    <a-switch v-model:checked="checked" :disabled="disabled" />
    <a-button type="primary" @click="onToggle">Toggle disabled</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref<boolean>(true);
const disabled = ref<boolean>(true);

const onToggle = () => {
  disabled.value = !disabled.value;
};
</script>
