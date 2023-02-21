<docs>
---
order: 3
title:
  zh-CN: 不可用
  en-US: Disabled
---

## zh-CN

Segmented 不可用。

## en-US
Disabled Segmented.
</docs>
<template>
  <div>
    <a-segmented v-model:value="value" disabled :options="data" />
    <br />
    <br />
    <a-segmented v-model:value="value2" :options="data2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  setup() {
    const data = reactive(['Map', 'Transit', 'Satellite']);
    const data2 = reactive([
      'Daily',
      { value: 'Weekly', disabled: true },
      'Monthly',
      { value: 'Quarterly', disabled: true },
      'Yearly',
    ]);
    const value = ref(data[0]);
    const value2 = ref('Daily');
    return {
      data,
      data2,
      value,
      value2,
    };
  },
});
</script>
