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
  <a-qrcode
    :error-level="level"
    value="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
  />
  <br />
  <br />
  <a-segmented v-model:value="level" :options="segmentedData" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const segmentedData = ['L', 'M', 'Q', 'H'];
    const level = ref(segmentedData[0]);
    return {
      segmentedData,
      level,
    };
  },
});
</script>
