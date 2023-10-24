<docs>
---
order: 3
title:
  zh-CN: 自动换行
  en-US: Wrap
---

## zh-CN

自动换行。

## en-US

Auto wrap line.

</docs>

<template>
  <a-flex wrap="wrap" gap="small">
    <a-button v-for="item in new Array(24)" :key="item" type="primary">Button</a-button>
  </a-flex>
</template>
