<docs>
---
order: 6
title:
  zh-CN: 分隔符
  en-US: Configuring the Separator
---

## zh-CN

使用 `Breadcrumb.Separator` 可以自定义分隔符，也可以传入一个函数来动态生成分隔符。

## en-US

The separator can be customized by setting the separator property: `Breadcrumb.Separator`.
You can also pass a generator function that receives the previous item and index to dynamically generate separators.

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

  <p style="margin: 16px 0">Using a separator generator function:</p>

  <a-breadcrumb :separator="separatorGenerator">
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item href="">Dashboard</a-breadcrumb-item>
    <a-breadcrumb-item href="">Settings</a-breadcrumb-item>
    <a-breadcrumb-item>Profile</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import type { SeparatorGeneratorFunc } from '../index';

const separatorGenerator: SeparatorGeneratorFunc = ({ index }) => String(index);
</script>
