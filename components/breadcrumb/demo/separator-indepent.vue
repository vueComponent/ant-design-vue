<docs>
---
order: 6
title:
  zh-CN: 分隔符
  en-US: Configuring the Separator
---

## zh-CN

使用 `Breadcrumb.Separator` 可以自定义分隔符。

## en-US

The separator can be customized by setting the separator property: `Breadcrumb.Separator`.

</docs>

<template>
  <a-breadcrumb separator="">
    <a-breadcrumb-item>Location</a-breadcrumb-item>
    <a-breadcrumb-separator>:</a-breadcrumb-separator>
    <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
    <a-breadcrumb-separator />
    <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
    <a-breadcrumb-separator />
    <a-breadcrumb-item>An Application</a-breadcrumb-item>
  </a-breadcrumb>
</template>
