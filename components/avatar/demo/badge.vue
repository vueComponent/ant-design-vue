<docs>
---
order: 3
title:
  zh-CN: 带徽标的头像
  en-US: With Badge
---

## zh-CN

通常用于消息提示。

## en-US

Usually used for reminders and notifications.
</docs>

<template>
  <a-space :size="24">
    <a-badge :count="1">
      <a-avatar shape="square">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-badge>
    <a-badge dot>
      <a-avatar shape="square">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-badge>
  </a-space>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
</script>
