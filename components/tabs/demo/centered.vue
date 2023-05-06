<docs>
---
order: 2
title:
  zh-CN: 居中
  en-US: Centered
---

## zh-CN

标签居中展示。

## en-US

Centered tabs.

</docs>

<template>
  <a-tabs v-model:activeKey="activeKey" centered>
    <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2" force-render>Content of Tab Pane 2</a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref('1');
</script>
