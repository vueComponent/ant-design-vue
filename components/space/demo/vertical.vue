<docs>
---
order: 3
title:
  zh-CN: 垂直间距
  en-US: Vertical Space
---

## zh-CN

相邻组件垂直间距。
可以设置 `width: 100%` 独占一行。


## en-US

Crowded components vertical spacing.
Can set `width: 100%` to fill a row.

</docs>

<template>
  <a-space direction="vertical">
    <a-card title="Card" style="width: 300px">
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
    <a-card title="Card" style="width: 300px">
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
  </a-space>
</template>
