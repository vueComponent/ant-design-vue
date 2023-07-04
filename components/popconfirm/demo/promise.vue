<docs>
---
order: 7
version: 3.0
title:
  zh-CN: 基于 Promise 的异步关闭 (3.0+)
  en-US: Asynchronously close on Promise (3.0+)
---

## zh-CN

点击确定后异步关闭 Popconfirm，例如提交表单。

## en-US

Asynchronously close a popconfirm when the OK button is pressed. For example, you can use this pattern when you submit a form.

</docs>

<template>
  <a-popconfirm title="Title" @confirm="confirm" @cancel="cancel">
    <a-button type="primary">Open Popconfirm with Promise</a-button>
  </a-popconfirm>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  setup() {
    const confirm = (e: MouseEvent) => {
      console.log(e);
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 3000);
      });
    };

    const cancel = (e: MouseEvent) => {
      console.log(e);
      message.error('Click on No');
    };
    return {
      confirm,
      cancel,
    };
  },
});
</script>
