<docs>
---
order: 0
title:
  zh-CN: 多行水印
  en-US: Multi-line watermark
---

## zh-CN

通过 `content` 设置 字符串数组 指定多行文字水印内容。

## en-US

Use 'content' to set a string array to specify multi-line text watermark content.

</docs>

<template>
  <a-watermark :content="['Ant Design Vue', 'Happy Working']">
    <div style="height: 500px" />
  </a-watermark>
</template>
