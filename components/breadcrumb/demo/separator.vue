<docs>
---
order: 4
title:
  zh-CN: 分隔符
  en-US: Configuring the Separator
---

## zh-CN

用` separator=">" `可以自定义分隔符，或者使用slot="separator"自定义更复杂的分隔符

## en-US

The separator can be customized by setting the separator preperty: separator=">" or use
  slot="separator"

</docs>

<template>
  <a-breadcrumb separator=">">
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
    <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
    <a-breadcrumb-item>An Application</a-breadcrumb-item>
  </a-breadcrumb>
  <a-breadcrumb>
    <template #separator><span style="color: red">></span></template>
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
    <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
    <a-breadcrumb-item>An Application</a-breadcrumb-item>
  </a-breadcrumb>
</template>
