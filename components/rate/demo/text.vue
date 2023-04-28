<docs>
---
order: 2
title:
  zh-CN: 文案展现
  en-US: Show copywriting
---

## zh-CN

给评分组件加上文案展示。

## en-US

Add copywriting in rate components.

</docs>
<template>
  <span>
    <a-rate v-model:value="value" :tooltips="desc" />
    <span class="ant-rate-text">{{ desc[value - 1] }}</span>
  </span>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
const desc = ref<string[]>(['terrible', 'bad', 'normal', 'good', 'wonderful']);
</script>
