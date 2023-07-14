<docs>
---
order: 1
title:
  zh-CN: 禁用
  en-US: Disabled
---

## zh-CN

禁用某一项。

## en-US

Disabled a tab.

</docs>

<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Tab 1">Tab 1</a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2" disabled>Tab 2</a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Tab 3</a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref('1');
</script>
