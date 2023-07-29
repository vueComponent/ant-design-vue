<docs>
---
order: 3
iframe: 360
title:
  zh-CN: 描述
  en-US: Description
---

## zh-CN

可以通过 `description` 设置文字内容。

> 仅当 `shape` 属性为 `square` 时支持。由于空间较小，推荐使用比较精简的双数文字。

## en-US

Setting `description` prop to show FloatButton with description.

> supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.


</docs>

<template>
  <a-float-button
    shape="square"
    description="HELP INFO"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </a-float-button>

  <a-float-button
    shape="square"
    description="HELP INFO"
    :style="{
      right: '94px',
    }"
  ></a-float-button>

  <a-float-button
    shape="square"
    description="HELP"
    :style="{
      right: '164px',
    }"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </a-float-button>
</template>

<script lang="ts" setup>
import { FileTextOutlined } from '@ant-design/icons-vue';
</script>
