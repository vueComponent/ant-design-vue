<docs>
---
order: 7
title:
  zh-CN: 进度
  en-US: progress
---

## zh-CN

展示进度，当设置 `percent="auto"` 时会预估一个永远不会停止的进度条。

## en-US

Show the progress. When `percent="auto"` is set, an indeterminate progress will be displayed.

</docs>

<template>
  <div style="display: flex; align-items: center; gap: 16px">
    <!-- 开关组件 -->
    <a-switch
      v-model:checked="auto"
      checked-children="Auto"
      un-checked-children="Auto"
      @change="toggleAuto"
    />

    <!-- 加载动画组件 -->
    <a-spin :percent="mergedPercent" size="small" />
    <a-spin :percent="mergedPercent" />
    <a-spin :percent="mergedPercent" size="large" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted, getCurrentInstance } from 'vue';

const auto = ref(false); // 是否启用自动模式
const percent = ref(-50); // 当前加载百分比
let interval = null;

const mergedPercent = computed(() => (auto.value ? 'auto' : percent.value));

const toggleAuto = checked => {
  auto.value = checked;
};

onMounted(() => {
  interval = setInterval(() => {
    percent.value = percent.value + 5;
    if (percent.value > 150) {
      percent.value = -50;
    }
  }, 100);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>
<style scoped></style>
