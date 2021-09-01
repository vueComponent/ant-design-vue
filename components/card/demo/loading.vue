<docs>
---
order: 6
title:
  zh-CN: 预加载的卡片
  en-US: Loading card
---

## zh-CN

数据读入前会有文本块样式

## en-US

Shows a loading indirector while the contents of the card is being featched

</docs>

<template>
  <a-card :loading="loading" title="Card title">whatever content</a-card>
  <a-button style="margin-top: 16px" @click="handleClick">Toggle loading</a-button>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const loading = ref(true);

    const handleClick = () => {
      loading.value = !loading.value;
    };

    return {
      loading,
      handleClick,
    };
  },
});
</script>
