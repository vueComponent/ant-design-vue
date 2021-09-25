<docs>
---
order: 0
title:
  zh-CN: 典型卡片
  en-US: Basic card
---

## zh-CN

包含标题、内容、操作区域。
可通过设置size为`default`或者`small`，控制尺寸

## en-US

A basic card containing a title, content and an extra corner content.
Supports two sizes: `default` and `small`.
</docs>

<template>
  <a-card title="Default size card" style="width: 300px">
    <template #extra><a href="#">more</a></template>
    <p>card content</p>
    <p>card content</p>
    <p>card content</p>
  </a-card>
  <br />
  <a-card size="small" title="Small size card" style="width: 300px">
    <template #extra><a href="#">more</a></template>
    <p>card content</p>
    <p>card content</p>
    <p>card content</p>
  </a-card>
</template>
