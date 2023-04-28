<docs>
---
order: 8
title:
  zh-CN: 高级用法
  en-US: Advanced Usage
---

## zh-CN

带气泡卡片的例子。

## en-US
With Popover.
</docs>

<template>
  <a-popover>
    <template #content>
      <a-qrcode value="http://www.antv.com" />
    </template>
    <img width="100" height="100" src="https://aliyuncdn.antdv.com/logo.png" />
  </a-popover>
</template>
