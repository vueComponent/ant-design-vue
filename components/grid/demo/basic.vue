<docs>
---
order: 0
title:
  zh-CN: 基础栅格
  en-US: Basic Grid
---

## zh-CN

从堆叠到水平排列。

使用单一的一组 `Row` 和 `Col` 栅格组件，就可以创建一个基本的栅格系统，所有列（Col）必须放在 `Row` 内。

## en-US

From the stack to the horizontal arrangement.

You can create a basic grid system by using a single set of `Row` and `Col` grid assembly, all of the columns (Col) must be placed in `Row`.

</docs>

<template>
  <a-row>
    <a-col :span="24">col</a-col>
  </a-row>
  <a-row>
    <a-col :span="12">col-12</a-col>
    <a-col :span="12">col-12</a-col>
  </a-row>
  <a-row>
    <a-col :span="8">col-8</a-col>
    <a-col :span="8">col-8</a-col>
    <a-col :span="8">col-8</a-col>
  </a-row>
  <a-row>
    <a-col :span="6">col-6</a-col>
    <a-col :span="6">col-6</a-col>
    <a-col :span="6">col-6</a-col>
    <a-col :span="6">col-6</a-col>
  </a-row>
</template>
