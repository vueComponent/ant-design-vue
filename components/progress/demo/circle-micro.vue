<docs>
---
order: 13
title:
  zh-CN: 响应式进度圈
  en-US: Responsive circular progress bar
---

## zh-CN

响应式的圈形进度，当 `width` 小于等于 20 的时候，进度信息将不会显示在进度圈里面，而是以 Tooltip 的形式显示。

## en-US

Responsive circular progress bar. When `width` is smaller than 20, progress information will be displayed in Tooltip.


</docs>

<template>
  <div>
    <a-progress
      type="circle"
      trail-color="#e6f4ff"
      :percent="60"
      :stroke-width="20"
      :size="12"
      :format="number => `进行中，已完成${number}%`"
    />
    <span :style="{ marginLeft: 8 }">代码发布</span>
  </div>
</template>
