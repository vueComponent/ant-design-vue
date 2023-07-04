<docs>
---
order: 5
title:
  zh-CN: 更新消息内容
  en-US: Update Message Content
---

## zh-CN

可以通过唯一的 `key` 来更新内容、或者响应式数据。

## en-US

Update message content with unique `key`，or use reactive data.

</docs>

<template>
  <a-button type="primary" @click="openMessage">Open the message box (update by key)</a-button>
  <br />
  <br />
  <a-button type="primary" @click="openMessage2">
    Open the message box (update by reactive)
  </a-button>
</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
const key = 'updatable';
export default defineComponent({
  setup() {
    const openMessage = () => {
      message.loading({ content: 'Loading...', key });
      setTimeout(() => {
        message.success({ content: 'Loaded!', key, duration: 2 });
      }, 1000);
    };
    const content = ref('Loading...');
    const openMessage2 = () => {
      // content must use function
      message.loading({ content: () => content.value });
      setTimeout(() => {
        content.value = 'Loaded!';
      }, 1000);
    };
    return {
      openMessage,
      openMessage2,
    };
  },
});
</script>
