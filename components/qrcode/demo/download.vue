<docs>
---
order: 6
title:
  zh-CN: 下载二维码
  en-US: Download QRCode
---

## zh-CN

下载二维码的简单实现。

## en-US
A way to download QRCode.
</docs>

<template>
  <a-qrcode ref="qrcodeCanvasRef" value="http://www.antdv.com" />
  <br />
  <br />
  <a-button type="primary" @click="dowloadChange">Downlaod</a-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>
