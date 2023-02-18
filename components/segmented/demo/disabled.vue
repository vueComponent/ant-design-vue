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
    <a-segmented disabled :options="data" />
    <br />
    <br />
    <a-segmented :options="data2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

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
    return {
      data,
      data2,
    };
  },
});
</script>
