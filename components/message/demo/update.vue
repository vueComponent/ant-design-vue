<docs>
---
order: 5
title:
  zh-CN: 更新消息内容
  en-US: Update Message Content
---

## zh-CN

可以通过唯一的 `key` 来更新内容。

## en-US

Update message content with unique `key`.

</docs>

<template>
  <a-button type="primary" @click="openMessage">Open the message box</a-button>
</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
const key = 'updatable';
export default defineComponent({
  setup() {
    const openMessage = () => {
      message.loading({ content: 'Loading...', key });
      setTimeout(() => {
        message.success({ content: 'Loaded!', key, duration: 2 });
      }, 1000);
    };
    return {
      openMessage,
    };
  },
});
</script>
