<docs>
---
order: 6
title:
  zh-CN: 三种大小
  en-US: Three sizes of Segmented
---

## zh-CN

我们为 `<a-segmented />` 组件定义了三种尺寸（大、默认、小），高度分别为 `40px`、`32px` 和 `24px`。

## en-US
There are three sizes of an a-segmented: `large` (40px), `default` (32px) and `small` (24px).
</docs>
<template>
  <a-segmented :options="data" size="large" />
  <br />
  <br />
  <a-segmented :options="data" />
  <br />
  <br />
  <a-segmented :options="data" size="small" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const data = reactive(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']);
    return {
      data,
    };
  },
});
</script>
