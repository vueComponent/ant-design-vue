<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

最简单的用法，浮层的大小由内容区域决定。

## en-US

The most basic example. The size of the floating layer depends on the contents region.

</docs>
<template>
  <a-popover title="Title">
    <template #content>
      <p>Content</p>
      <p>Content</p>
    </template>
    <a-button type="primary">Hover me</a-button>
  </a-popover>
</template>
