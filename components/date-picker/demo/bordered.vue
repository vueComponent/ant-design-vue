<docs>
---
order: 23
title:
  zh-CN: 无边框
  en-US: Bordered-less
---

## zh-CN

无边框样式。

## en-US

Bordered-less style component.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value1" :bordered="false"/>
    <a-date-picker v-model:value="value2" picker="week" :bordered="false"/>
    <a-date-picker v-model:value="value3" picker="month" :bordered="false"/>
    <a-date-picker v-model:value="value4" picker="quarter" :bordered="false"/>
    <a-date-picker v-model:value="value5" picker="year" :bordered="false"/>

    <a-range-picker v-model:value="value6" :bordered="false" />
    <a-range-picker v-model:value="value7" picker="week" :bordered="false" />
    <a-range-picker v-model:value="value8" picker="month" :bordered="false" />
    <a-range-picker v-model:value="value9" picker="year" :bordered="false" />
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Dayjs } from 'dayjs';
export default defineComponent({
  setup() {
    return {
      value1: ref<Dayjs>(),
      value2: ref<Dayjs>(),
      value3: ref<Dayjs>(),
      value4: ref<Dayjs>(),
      value5: ref<Dayjs>(),
      value6: ref<Dayjs[]>([]),
      value7: ref<Dayjs[]>([]),
      value8: ref<Dayjs[]>([]),
      value9: ref<Dayjs[]>([]),
    };
  },
});
</script>
