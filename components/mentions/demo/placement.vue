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
  <a-mentions v-model:value="value" placement="top" :options="options"></a-mentions>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>('');
    return {
      value,
      options: [
        {
          value: 'afc163',
          label: 'afc163',
        },
        {
          value: 'zombieJ',
          label: 'zombieJ',
        },
        {
          value: 'yesmeck',
          label: 'yesmeck',
        },
      ],
    };
  },
});
</script>
