<docs>
---
order: 2
title:
  zh-CN: 箭头指向
  en-US: Arrow pointing at the center
---

## zh-CN

设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。

## en-US

By specifying `arrowPointAtCenter` prop, the arrow will point to the center of the target element.

</docs>

<template>
  <a-space>
    <a-tooltip placement="topLeft" title="Prompt Text">
      <a-button>Align edge / 边缘对齐</a-button>
    </a-tooltip>
    <a-tooltip placement="topLeft" title="Prompt Text" arrow-point-at-center>
      <a-button>Arrow points to center / 箭头指向中心</a-button>
    </a-tooltip>
  </a-space>
</template>
