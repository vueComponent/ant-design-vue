<docs>
---
order: 3
title:
  zh-CN: 从浮层内关闭
  en-US: Controlling the close of the dialog
---

## zh-CN

使用 `visible` 属性控制浮层显示。

## en-US

Use `visible` prop to control the display of the card.

</docs>
<template>
  <a-popover v-model:visible="visible" title="Title" trigger="click">
    <template #content>
      <a @click="hide">Close</a>
    </template>
    <a-button type="primary">Click me</a-button>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);

    const hide = () => {
      visible.value = false;
    };

    return {
      visible,
      hide,
    };
  },
});
</script>
