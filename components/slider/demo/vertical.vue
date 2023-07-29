<docs>
---
order: 6
title:
  zh-CN: 垂直
  en-US: Vertical
---

## zh-CN

垂直方向的 Slider。

## en-US

The vertical Slider.
</docs>

<template>
  <div style="height: 300px">
    <div style="display: inline-block; height: 300px; margin-left: 70px">
      <a-slider v-model:value="value1" vertical />
    </div>
    <div style="display: inline-block; height: 300px; margin-left: 70px">
      <a-slider v-model:value="value2" vertical range :step="10" />
    </div>
    <div style="display: inline-block; height: 300px; margin-left: 70px">
      <a-slider v-model:value="value3" vertical range :marks="marks" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, createVNode } from 'vue';
const value1 = ref<number>(30);
const value2 = ref<[number, number]>([20, 50]);
const value3 = ref<[number, number]>([26, 37]);
const marks = ref<Record<number, any>>({
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: createVNode('strong', {}, '100°C'),
  },
});
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
