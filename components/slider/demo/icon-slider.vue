<docs>
---
order: 2
title:
  zh-CN: 带 icon 的滑块
  en-US: Slider with icon
---

## zh-CN

滑块左右可以设置图标来表达业务含义。

## en-US

You can add an icon beside the slider to make it meaningful.
</docs>

<template>
  <div class="icon-wrapper">
    <frown-outlined :style="{ color: preColor }" />
    <a-slider v-model:value="sliderValue" :min="0" :max="20" />
    <smile-outlined :style="{ color: nextColor }" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons-vue';
const sliderValue = ref<number>(0);
const min = ref<number>(0);
const max = ref<number>(20);

const preColor = computed(() => {
  const mid = +((max.value - min.value) / 2).toFixed(5);
  return sliderValue.value >= mid ? '' : 'rgba(0, 0, 0, .45)';
});

const nextColor = computed(() => {
  const mid = +((max.value - min.value) / 2).toFixed(5);
  return sliderValue.value >= mid ? 'rgba(0, 0, 0, .45)' : '';
});
</script>
<style scoped>
.icon-wrapper {
  position: relative;
  padding: 0px 30px;
}

.icon-wrapper .anticon {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  line-height: 1;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
}

.icon-wrapper .anticon:first-child {
  left: 0;
}

.icon-wrapper .anticon:last-child {
  right: 0;
}
</style>
