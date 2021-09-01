<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

最简单的用法。

## en-US

The basic example.

</docs>

<template>
  <a-popconfirm
    title="Are you sure delete this task?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="confirm"
    @cancel="cancel"
  >
    <a href="#">Delete</a>
  </a-popconfirm>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  setup() {
    const confirm = (e: MouseEvent) => {
      console.log(e);
      message.success('Click on Yes');
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
