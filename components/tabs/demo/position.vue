<docs>
---
order: 6
title:
  zh-CN: 位置
  en-US: Position
---

## zh-CN

有四个位置，`tabPosition="left|right|top|bottom"`。在移动端下，`bottom|right` 会自动切换成 `top`。

## en-US

Tab's position: left, right, top or bottom.  Will auto switch to `top` in mobile.

</docs>

<template>
  <a-radio-group v-model:value="tabPosition" style="margin: 8px">
    <a-radio-button value="top">top</a-radio-button>
    <a-radio-button value="bottom">bottom</a-radio-button>
    <a-radio-button value="left">left</a-radio-button>
    <a-radio-button value="right">right</a-radio-button>
  </a-radio-group>
  <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition">
    <a-tab-pane key="1" tab="Tab 1">Content of Tab 1</a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2">Content of Tab 2</a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Content of Tab 3</a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const tabPosition = ref('top');
    const activeKey = ref('1');

    return {
      tabPosition,
      activeKey,
    };
  },
});
</script>
