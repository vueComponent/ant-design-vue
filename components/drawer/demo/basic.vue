<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

基础抽屉，点击触发按钮抽屉从右滑出，点击遮罩区关闭

## en-US

Basic drawer.

</docs>

<template>
  <a-button type="primary" @click="showDrawer">Open</a-button>
  <a-drawer
    v-model:visible="visible"
    class="custom-class"
    style="color: red"
    title="Basic Drawer"
    placement="right"
    @after-visible-change="afterVisibleChange"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);

    const afterVisibleChange = (bool: boolean) => {
      console.log('visible', bool);
    };

    const showDrawer = () => {
      visible.value = true;
    };

    return {
      visible,
      afterVisibleChange,
      showDrawer,
    };
  },
});
</script>
