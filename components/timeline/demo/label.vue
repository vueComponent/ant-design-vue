<docs>
---
order: 5
title:
  zh-CN: 标签
  en-US: Label
---

## zh-CN

使用 `label` 标签单独展示时间。

## en-US

Use `label` show time alone.

</docs>

<template>
  <a-radio-group v-model:value="mode" style="margin-bottom: 20px">
    <a-radio value="left">Left</a-radio>
    <a-radio value="right">Right</a-radio>
    <a-radio value="alternate">Alternate</a-radio>
  </a-radio-group>
  <a-timeline :mode="mode">
    <a-timeline-item label="2015-09-01">Create a services</a-timeline-item>
    <a-timeline-item label="2015-09-01 09:12:11">Solve initial network problems</a-timeline-item>
    <a-timeline-item>Technical testing</a-timeline-item>
    <a-timeline-item>
      <template #label><strong style="color: red">2015-09-01 09:12:11</strong></template>
      Network problems being solved
    </a-timeline-item>
  </a-timeline>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      mode: ref('left'),
    };
  },
});
</script>
