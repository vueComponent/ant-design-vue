<docs>
---
order: 2
title:
  zh-CN: 可关闭的警告提示
  en-US: Customized Close Text
---

## zh-CN

显示关闭按钮，点击可关闭警告提示。

## en-US

To show close button.

</docs>

<template>
  <a-alert
    message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
    type="warning"
    closable
    @close="onClose"
  />
  <a-alert
    message="Error Text"
    description="Error Description Error Description Error Description Error Description Error Description Error Description"
    type="error"
    closable
    @close="onClose"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const onClose = (e: MouseEvent) => {
      console.log(e, 'I was closed.');
    };
    return {
      onClose,
    };
  },
});
</script>
