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
      <a-slider vertical v-model:value="value1" />
    </div>
    <div style="display: inline-block; height: 300px; margin-left: 70px">
      <a-slider vertical range :step="10" v-model:value="value2" />
    </div>
    <div style="display: inline-block; height: 300px; margin-left: 70px">
      <a-slider vertical range :marks="marks" v-model:value="value3" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, createVNode } from 'vue';
export default defineComponent({
  setup() {
    const value1 = ref<number>(30);
    const value2 = ref<number[]>([20, 50]);
    const value3 = ref<number[]>([26, 37]);
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

    return {
      value1,
      value2,
      value3,
      marks,
    };
  },
});
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
