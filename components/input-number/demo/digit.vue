<docs>
---
order: 3
title:
  zh-CN: 高精度小数
  en-US: High precision decimals
---

## zh-CN

通过 `stringMode` 开启高精度小数支持，`change` 事件将返回 string 类型。
对于旧版浏览器，你需要 BigInt polyfill。

## en-US

Use `stringMode` to support high precision decimals support.
`change` will return string value instead. You need polyfill of BigInt if browser not support.

</docs>

<template>
  <a-input-number
    v-model:value="value"
    style="width: 200px"
    :min="0"
    :max="10"
    :step="0.00000000000001"
    string-mode
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('1');
</script>
