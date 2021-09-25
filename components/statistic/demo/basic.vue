<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

简单展示

## en-US

Simplest Usage.

</docs>

<template>
  <a-row>
    <a-col :span="12">
      <a-statistic title="Active Users" :value="112893" style="margin-right: 50px" />
    </a-col>
    <a-col :span="12">
      <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
    </a-col>
  </a-row>
</template>
