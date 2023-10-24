<docs>
---
order: 4
title:
  zh-CN: 组合使用
  en-US: combination
---

## zh-CN

嵌套使用，可以实现更复杂的布局。

## en-US

Nesting can achieve more complex layouts.

</docs>

<template>
  <a-card :style="cardStyle" :body-style="{ padding: 0, overflow: 'hidden' }">
    <a-flex justify="space-between">
      <img
        alt="avatar"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        :style="imgStyle"
      />
      <a-flex vertical align="flex-end" justify="space-between" :style="{ padding: '32px' }">
        <a-typography>
          <a-typography-title :level="3">
            “antd is an enterprise-class UI design language and Vue UI library.”
          </a-typography-title>
        </a-typography>
        <a-button type="primary" href="https://antdv.com" target="_blank">Get Start</a-button>
      </a-flex>
    </a-flex>
  </a-card>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
const cardStyle: CSSProperties = {
  width: '620px',
};
const imgStyle: CSSProperties = {
  display: 'block',
  width: '273px',
};
</script>
