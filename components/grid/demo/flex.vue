<docs>
---
order: 4
title:
  zh-CN: 排版
  en-US: Typesetting
---

## zh-CN

布局基础。

子元素根据不同的值 `start`,`center`,`end`,`space-between`,`space-around`，分别定义其在父节点里面的排版方式。

## en-US

Child elements depending on the value of the `start`,`center`, `end`,`space-between`, `space-around`, which are defined in its parent node typesetting mode.

</docs>

<template>
  <div id="components-grid-demo-flex">
    <p>sub-element align left</p>
    <a-row type="flex" justify="start">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element align center</p>
    <a-row type="flex" justify="center">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element align right</p>
    <a-row type="flex" justify="end">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element monospaced arrangement</p>
    <a-row type="flex" justify="space-between">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element align full</p>
    <a-row type="flex" justify="space-around">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
#components-grid-demo-flex :deep(.ant-row) {
  background: rgba(128, 128, 128, 0.08);
}
</style>
