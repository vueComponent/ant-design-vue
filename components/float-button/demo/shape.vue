<docs>
---
order: 2
iframe: 360
title:
  zh-CN: 形状
  en-US: Shape
---

## zh-CN

最简单的用法。

## en-US

The most basic usage.

</docs>

<template>
  <a-float-button @click="handleClick" />

  <a-float-button
    shape="circle"
    type="primary"
    :style="{
      right: '94px',
    }"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </a-float-button>

  <a-float-button
    shape="square"
    type="primary"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </a-float-button>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined } from '@ant-design/icons-vue';
const handleClick = () => console.log('click');
</script>
