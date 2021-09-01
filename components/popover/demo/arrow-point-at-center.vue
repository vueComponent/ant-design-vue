<docs>
---
order: 4
title:
  zh-CN: 箭头指向
  en-US: Arrow pointing
---

## zh-CN

设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。

## en-US

The arrow points to the center of the target element, which set `arrowPointAtCenter`.

</docs>
<template>
  <div>
    <a-popover placement="topLeft">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <template #title>
        <span>Title</span>
      </template>
      <a-button>Align edge / 边缘对齐</a-button>
    </a-popover>
    <a-popover placement="topLeft" arrow-point-at-center>
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <template #title>
        <span>Title</span>
      </template>
      <a-button>Arrow points to center / 箭头指向中心</a-button>
    </a-popover>
  </div>
</template>
