<docs>
---
order: 3
title:
  zh-CN: 讨嫌的小红点
  en-US: Red badge
---

## zh-CN

没有具体的数字。

## en-US

This will simply display a red badge, without a specific count.
If count equals 0, it won't display the dot.
</docs>

<template>
  <a-badge dot>
    <notification-outlined style="font-size: 16px" />
  </a-badge>
  <a-badge dot>
    <a href="#">Link something</a>
  </a-badge>
</template>
<script lang="ts" setup>
import { NotificationOutlined } from '@ant-design/icons-vue';
</script>
