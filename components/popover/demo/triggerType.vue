<docs>
---
order: 1
title:
  zh-CN: 三种触发方式
  en-US: Three ways to trigger
---

## zh-CN

鼠标移入、聚集、点击。

## en-US

Mouse to click, focus and move in.

</docs>
<template>
  <div>
    <a-popover title="Title" trigger="hover">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Hover me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="focus">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Focus me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="click">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Click me</a-button>
    </a-popover>
  </div>
</template>
<style>
#components-popover-demo-triggerType .ant-btn {
  margin-right: 8px;
}
</style>
