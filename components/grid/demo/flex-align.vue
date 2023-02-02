<docs>
---
order: 5
title:
  zh-CN: 对齐
  en-US: Alignment
---

## zh-CN

子元素垂直对齐。

## en-US

Child elements vertically aligned.

</docs>

<template>
  <div id="components-grid-demo-flex-align">
    <a-divider orientation="left">Align Top</a-divider>
    <a-row justify="center" align="top">
      <a-col :span="4">
        <p class="height-100">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-50">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-120">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-80">col-4</p>
      </a-col>
    </a-row>

    <a-divider orientation="left">Align Middle</a-divider>
    <a-row justify="space-around" align="middle">
      <a-col :span="4">
        <p class="height-100">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-50">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-120">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-80">col-4</p>
      </a-col>
    </a-row>

    <a-divider orientation="left">Align Bottom</a-divider>
    <a-row justify="space-between" align="bottom">
      <a-col :span="4">
        <p class="height-100">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-50">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-120">col-4</p>
      </a-col>
      <a-col :span="4">
        <p class="height-80">col-4</p>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
:deep(#components-grid-demo-flex-align) [class~='ant-row'] {
  background: rgba(128, 128, 128, 0.08);
}
</style>
