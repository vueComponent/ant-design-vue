<docs>
---
order: 6
title:
  zh-CN: 自定义样式
  en-US: Customized style
---

## zh-CN

使用 `style` 和 `class` 来定义样式。

## en-US

The `style` and `class` are available to customize Message.

</docs>

<template>
  <a-button @click="success">Customized style</a-button>
</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const success = () => {
      message.success({
        content: () => 'This is a prompt message with custom className and style',
        class: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
    };
    return {
      success,
    };
  },
});
</script>
<style>
.custom-class {
  color: red;
}
</style>
