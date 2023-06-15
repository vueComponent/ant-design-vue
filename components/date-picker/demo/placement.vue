<docs>
---
order: 28
title:
  zh-CN: 弹出位置
  en-US: Popup Placement
---

## zh-CN

可以通过 `placement` 手动指定弹出的位置。

## en-US

You can manually specify the position of the popup via `placement`.

</docs>

<template>
  <a-radio-group v-model:value="placement">
    <a-radio-button value="topLeft">topLeft</a-radio-button>
    <a-radio-button value="topRight">topRight</a-radio-button>
    <a-radio-button value="bottomLeft">bottomLeft</a-radio-button>
    <a-radio-button value="bottomRight">bottomRight</a-radio-button>
  </a-radio-group>
  <br />
  <br />
  <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value1" :placement="placement" />
    <a-range-picker v-model:value="value2" :placement="placement" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
const placement = ref('topLeft' as const);
const value1 = ref<Dayjs>();
const value2 = ref<[Dayjs, Dayjs]>();
</script>
