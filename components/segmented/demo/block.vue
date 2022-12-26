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
  <a-segmented block :options="data" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const data = reactive([123, 456, 'longtext-longtext-longtext-longtext']);
    return {
      data,
    };
  },
});
</script>
