<docs>
---
order: 8
title:
  zh-CN: 垂直方向紧凑布局
  en-US: Vertical Compact Mode
---

## zh-CN

垂直方向的紧凑布局，目前仅支持 Button 组合。

## en-US

Vertical Mode for Space.Compact, support Button only.

</docs>

<template>
  <a-space>
    <a-space-compact direction="vertical">
      <a-button>Button 1</a-button>
      <a-button>Button 2</a-button>
      <a-button>Button 3</a-button>
    </a-space-compact>
    <a-space-compact direction="vertical">
      <a-button type="dashed">Button 1</a-button>
      <a-button type="dashed">Button 2</a-button>
      <a-button type="dashed">Button 3</a-button>
    </a-space-compact>
    <a-space-compact direction="vertical">
      <a-button type="primary">Button 1</a-button>
      <a-button type="primary">Button 2</a-button>
      <a-button type="primary">Button 3</a-button>
    </a-space-compact>
  </a-space>
</template>
