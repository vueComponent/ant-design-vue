<docs>
---
order: 7
title:
  zh-CN: 无边框
  en-US: Border Less
---

## zh-CN

无边框模式。

## en-US
border less.

</docs>

<template>
  <a-space :size="[0, 'small']" wrap>
    <a-tag :bordered="false">Tag 1</a-tag>
    <a-tag :bordered="false">Tag 2</a-tag>
    <a-tag :bordered="false" closable>Tag 3</a-tag>
    <a-tag :bordered="false" closable>Tag 4</a-tag>
  </a-space>
  <a-divider />
  <a-space :size="[0, 'small']" wrap>
    <a-tag :bordered="false" color="processing">processing</a-tag>
    <a-tag :bordered="false" color="success">success</a-tag>
    <a-tag :bordered="false" color="error">error</a-tag>
    <a-tag :bordered="false" color="warning">warning</a-tag>
    <a-tag :bordered="false" color="magenta">magenta</a-tag>
    <a-tag :bordered="false" color="red">red</a-tag>
    <a-tag :bordered="false" color="volcano">volcano</a-tag>
    <a-tag :bordered="false" color="orange">orange</a-tag>
    <a-tag :bordered="false" color="gold">gold</a-tag>
    <a-tag :bordered="false" color="lime">lime</a-tag>
    <a-tag :bordered="false" color="green">green</a-tag>
    <a-tag :bordered="false" color="cyan">cyan</a-tag>
    <a-tag :bordered="false" color="blue">blue</a-tag>
    <a-tag :bordered="false" color="geekblue">geekblue</a-tag>
    <a-tag :bordered="false" color="purple">purple</a-tag>
  </a-space>
</template>
