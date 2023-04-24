<docs>
---
order: 1
iframe: 360
title:
  zh-CN: 类型
  en-US: Type
---

## zh-CN

通过 `type` 改变悬浮按钮的类型。

## en-US

Change the type of the FloatButton with `type`.

</docs>

<template>
  <a-float-button
    type="primary"
    :style="{
      right: '24px',
    }"
  >
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </a-float-button>

  <a-float-button
    type="default"
    :style="{
      right: '94px',
    }"
  >
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </a-float-button>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
</script>
