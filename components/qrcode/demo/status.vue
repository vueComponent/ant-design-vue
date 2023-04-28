<docs>
---
order: 3
title:
  zh-CN: 不同的状态
  en-US: other status
---

## zh-CN

可以通过 status 的值控制二维码的状态。

## en-US
The status can be controlled by the value `status`.
</docs>

<template>
  <a-space>
    <div><a-qrcode value="http://www.antv.com" status="loading" /></div>
    <div><a-qrcode value="http://www.antv.com" status="expired" @refresh="refreshChange" /></div>
  </a-space>
</template>

<script lang="ts" setup>
const refreshChange = () => alert('updated');
</script>
