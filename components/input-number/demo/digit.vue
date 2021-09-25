<docs>
---
order: 0
title:
  zh-CN: 小数
  en-US: Decimals
---

## zh-CN

和原生的数字输入框一样，value 的精度由 step 的小数位数决定。

## en-US

A numeric-only input box whose values can be increased or decreased using a decimal step. The number of decimals (also known as precision) is determined by the step prop.

</docs>

<template>
  <a-input-number v-model:value="value" :min="0" :max="10" :step="0.1" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<number>();

    return {
      value,
    };
  },
});
</script>
