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
    <a-qrcode value="http://www.antdv.com" status="loading" />
    <a-qrcode
      value="http://www.antdv.com"
      status="expired"
      @refresh="() => console.log('refresh')"
    />
  </a-space>
</template>
