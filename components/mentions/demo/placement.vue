<docs>
---
order: 4
title:
  zh-CN: 向上展开
  en-US: Placemen
---

## zh-CN

向上展开建议。

## en-US

Change the suggestions placement.

</docs>
<template>
  <a-mentions v-model:value="value" placement="top">
    <a-mentions-option value="afc163">afc163</a-mentions-option>
    <a-mentions-option value="zombieJ">zombieJ</a-mentions-option>
    <a-mentions-option value="yesmeck">yesmeck</a-mentions-option>
  </a-mentions>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>('');
    return {
      value,
    };
  },
});
</script>
