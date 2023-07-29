<docs>
---
order: 4
iframe: 360
title:
  zh-CN: 含有气泡卡片的悬浮按钮
  en-US: FloatButton with tooltip
---

## zh-CN

设置 tooltip 属性，即可开启气泡卡片。

## en-US

Setting `tooltip` prop to show FloatButton with tooltip.

</docs>

<template>
  <a-float-button
    tooltip="HELP INFO"
    :style="{
      right: '24px',
    }"
  ></a-float-button>

  <a-float-button
    :style="{
      right: '94px',
    }"
  >
    <template #tooltip>
      <div>Documents</div>
    </template>
  </a-float-button>
</template>
