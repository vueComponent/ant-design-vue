<docs>
---
order: 6
title: 
  zh-CN: 自定义标题
  en-US: Title
---

## zh-CN

设置鼠标放在状态点上时显示的文字

## en-US

The badge will display `title` when hovered over, instead of `count`.

</docs>

<template>
  <div id="components-badge-demo-title">
    <a-badge :count="5" title="Custom hover text">
      <a href="#" class="head-example" />
    </a-badge>
  </div>
</template>
<style scoped>
#components-badge-demo-title .ant-badge:not(.ant-badge-status) {
  margin-right: 20px;
}
.head-example {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  background: #eee;
  display: inline-block;
}
</style>
