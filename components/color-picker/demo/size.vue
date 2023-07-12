<docs>
---
order: 8
title:
  zh-CN: 触发器尺寸大小
  en-US: Trigger size
---

## zh-CN

触发器有大、中、小三种尺寸，若不设置 size，则尺寸为中。

## en-US

The trigger has three sizes: large, medium and small. If size is not set, the size will be medium.
</docs>

<template>
  <a-space>
    <a-space direction="vertical">
      <a-color-picker size="large" />
      <a-color-picker />
      <a-color-picker size="small" />
    </a-space>
    <a-space direction="vertical">
      <a-color-picker size="large" show-text />
      <a-color-picker show-text />
      <a-color-picker size="small" show-text />
    </a-space>
  </a-space>
</template>
