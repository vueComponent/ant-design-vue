<docs>
---
order: 10
title:
  zh-CN: 带移除图标
  en-US: With clear icon
---

## zh-CN

带移除图标的输入框，点击图标删除所有内容。

## en-US

Input type of password.

</docs>
<template>
  <div>
    <a-input v-model:value="value1" placeholder="input with clear icon" allow-clear />
    <br />
    <br />
    <a-textarea v-model:value="value2" placeholder="textarea with clear icon" allow-clear />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value1 = ref<string>('');
    const value2 = ref<string>('');

    return {
      value1,
      value2,
    };
  },
});
</script>
