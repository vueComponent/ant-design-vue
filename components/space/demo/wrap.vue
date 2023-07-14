<docs>
---
order: 0
title:
  zh-CN: 自动换行
  en-US: Basic Usage
---

## zh-CN

自动换行。

## en-US

Wrap

</docs>

<template>
  <a-space :size="[8, 16]" wrap>
    <template v-for="_i in 20" :key="_i">
      <a-button>Button</a-button>
    </template>
  </a-space>
</template>
