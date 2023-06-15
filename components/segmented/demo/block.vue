<docs>
---
order: 1
title:
  zh-CN: Block分段控制器
  en-US: Block Segmented
---

## zh-CN

`block` 属性使其适合父元素宽度。

## en-US
`block` property will make the `Segmented` fit to its parent width.
</docs>
<template>
  <a-segmented v-model:value="value" block :options="data" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const data = reactive([123, 456, 'longtext-longtext-longtext-longtext']);
const value = ref(data[0]);
</script>
