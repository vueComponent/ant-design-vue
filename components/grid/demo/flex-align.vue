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
  <p>Align Top</p>
  <a-row type="flex" justify="center" align="top">
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

  <p>Align Center</p>
  <a-row type="flex" justify="space-around" align="middle">
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

  <p>Align Bottom</p>
  <a-row type="flex" justify="space-between" align="bottom">
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
</template>
