<docs>
---
order: 1
title:
  zh-CN: 带 Icon 的例子
  en-US: With Icon
---

## zh-CN

带 Icon 的二维码。

## en-US
QRCode with Icon.
</docs>

<template>
  <a-qrcode
    error-level="H"
    value="https://www.antv.com"
    icon="https://www.antdv.com/assets/logo.1ef800a8.svg"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
