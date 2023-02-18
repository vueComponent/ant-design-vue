<docs>
---
order: 4
title:
  zh-CN: 受控模式
  en-US: Controlled mode
---

## zh-CN

受控的 Segmented

## en-US
Controlled Segmented.
</docs>
<template>
  <div>
    <a-segmented :options="data" default-value="1" @change="handle" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const data = reactive(['Map', 'Transit', 'Satellite']);
    const handle = v => console.log(v);
    return {
      data,
      handle,
    };
  },
});
</script>
