<docs>
---
order: 1
title:
  zh-CN: 半星
  en-US: Half star
---

## zh-CN

支持选中半星。

## en-US

Support select half star.

</docs>
<template>
  <a-rate v-model:value="value" allow-half />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<number>(2.5);
    return {
      value,
    };
  },
});
</script>
