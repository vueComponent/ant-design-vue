<docs>
---
order: 4
title:
  zh-CN: 控制关闭状态
  en-US: Controlled
---

## zh-CN

通过 `visible` 属性控制关闭状态。

## en-US

By using the `visible` prop, you can control the close state of Tag.

</docs>

<template>
  <a-tag v-model:visible="visible" closable>Movies</a-tag>
  <br />
  <a-button size="small" @click="visible = !visible">Toggle</a-button>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      visible: ref(false),
    };
  },
});
</script>
