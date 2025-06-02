<docs>
---
order: 6
title:
  zh-CN: 自定义指示符
  en-US: Custom spinning indicator
---

## zh-CN

使用自定义指示符。

## en-US

Use custom loading indicator.

</docs>

<template>
  <a-flex align="center" gap="middle">
    <a-spin :indicator="smallIndicator" />
    <a-spin :indicator="indicator" />
    <a-spin :indicator="largeIndicator" />
    <a-spin :indicator="customIndicator" />
  </a-flex>
</template>
<script lang="ts" setup>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
const smallIndicator = h(LoadingOutlined, {
  style: {
    fontSize: '16px',
  },
  spin: true,
});
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px',
  },
  spin: true,
});
const largeIndicator = h(LoadingOutlined, {
  style: {
    fontSize: '36px',
  },
  spin: true,
});
const customIndicator = h(LoadingOutlined, {
  style: {
    fontSize: '48px',
  },
  spin: true,
});
</script>
