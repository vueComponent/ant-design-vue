<template>
  <div>
    <a-space style="margin-bottom: 16px">
      <span>Tab position:</span>
      <a-radio-group v-model:value="tabPosition">
        <a-radio value="top">Top</a-radio>
        <a-radio value="bottom">Bottom</a-radio>
        <a-radio value="left">Left</a-radio>
        <a-radio value="right">Right</a-radio>
      </a-radio-group>
    </a-space>
    <a-tabs v-model:active-key="activeKey" :tab-position="tabPosition">
      <a-tab-pane key="1" tab="Tab 1">Content of Tab 1</a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">Content of Tab 2</a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">Content of Tab 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabPosition } from '../types'
const activeKey = ref('1')
const tabPosition = ref<TabPosition>('top')
</script>
