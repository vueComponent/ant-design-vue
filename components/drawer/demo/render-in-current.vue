<docs>
---
order: 3
title:
  zh-CN: 渲染在当前 DOM
  en-US: Render in current dom
---

## zh-CN

渲染在当前 dom 里。自定义容器，查看 `getContainer`。

## en-US

Render in current dom. custom container, check `getContainer`.

</docs>

<template>
  <div
    :style="{
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #ebedf0',
      borderRadius: '2px',
      padding: '48px',
      textAlign: 'center',
      background: '#fafafa',
      width: '100%',
    }"
  >
    Render in this
    <div style="margin-top: 16px">
      <a-button type="primary" @click="showDrawer">Open</a-button>
    </div>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :open="open"
      :get-container="false"
      :style="{ position: 'absolute' }"
      @close="onClose"
    >
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const open = ref(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>
