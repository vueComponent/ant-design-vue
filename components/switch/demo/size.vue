<docs>
---
order: 3
title:
  zh-CN: 两种大小
  en-US: Two sizes
---

## zh-CN

`size="small"` 表示小号开关。

## en-US

`size="small"` represents a small sized switch.

</docs>

<template>
  <div>
    <a-switch v-model:checked="checked1" />
    <br />
    <a-switch v-model:checked="checked2" size="small" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const state = reactive({
      checked1: true,
      checked2: false,
    });
    return { ...toRefs(state) };
  },
});
</script>
