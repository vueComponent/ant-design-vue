<docs>
---
order: 7
title:
  zh-CN: Flex 填充
  en-US: Flex Stretch
---

## zh-CN

Col 提供 `flex` 属性以支持填充。

## en-US

Col provides `flex` prop to support fill rest.

</docs>

<template>
  <a-divider orientation="left">Percentage columns</a-divider>
  <a-row>
    <a-col :flex="2">2 / 5</a-col>
    <a-col :flex="3">3 / 5</a-col>
  </a-row>
  <a-divider orientation="left">Fill rest</a-divider>
  <a-row>
    <a-col flex="100px">100px</a-col>
    <a-col flex="auto">auto</a-col>
  </a-row>
  <a-divider orientation="left">Raw flex style</a-divider>
  <a-row>
    <a-col flex="1 1 200px">1 1 200px</a-col>
    <a-col flex="0 1 300px">0 1 300px</a-col>
  </a-row>
  <a-row :wrap="false">
    <a-col flex="none">
      <div style="padding: 0 16px">none</div>
    </a-col>
    <a-col flex="auto">auto with no-wrap</a-col>
  </a-row>
</template>
