<docs>
---
order: 7
title:
  zh-CN: 纠错比例
  en-US: Error Level
---

## zh-CN

通过设置 errorLevel 调整不同的容错等级。

## en-US
set Error Level.
</docs>

<template>
  <a-qrcode v-model:error-level="level" value="http://www.antv.com" />
  <br />
  <br />
  <a-segmented v-model:value="level" :options="segmentedData" />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  setup() {
    const segmentedData = reactive(['L', 'M', 'Q', 'H']);
    const level = ref(segmentedData[0]);
    return {
      segmentedData,
      level,
    };
  },
});
</script>
