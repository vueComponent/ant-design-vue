<docs>
---
order: 4
title:
  zh-CN: 自定义渲染类型
  en-US: Custom Render Type
---

## zh-CN

通过设置 `type` 自定义渲染结果，提供 `canvas` 和 `svg` 两个选项。

## en-US
Customize the rendering results by `type`, provide options `canvas` and `svg`.
</docs>

<template>
  <a-space>
    <a-qrcode value="http://www.antdv.com" type="canvas" />
    <a-qrcode value="http://www.antdv.com" type="svg" />
  </a-space>
</template>
