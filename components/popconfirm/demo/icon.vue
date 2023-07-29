<docs>
---
order: 2
title:
  zh-CN: 自定义 Icon 图标
  en-US: Customize icon
---

## zh-CN

使用 `icon` 自定义提示 `icon`。

## en-US

Set `icon` props to customize the icon.

</docs>

<template>
  <a-popconfirm title="Are you sure？">
    <template #icon><question-circle-outlined style="color: red" /></template>
    <a href="#">Delete</a>
  </a-popconfirm>
</template>
<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
</script>
