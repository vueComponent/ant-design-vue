<docs>
---
order: 3
title:
  zh-CN: 默认的每页条数
  en-US: Default page size
---

## zh-CN

默认的每页条数

## en-US

Default page size
</docs>
<template>
  <a-pagination
    v-model:current="current"
    :page-size-options="pageSizeOptions"
    :total="total"
    show-size-changer
    @showSizeChange="onShowSizeChange"
  ></a-pagination>

  <br />

  <a-pagination
    v-model:current="current"
    :page-size-options="pageSizeOptions"
    :total="total"
    show-size-changer
    :default-page-size="40"
    @showSizeChange="onShowSizeChange"
  ></a-pagination>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const pageSizeOptions = ref<string[]>(['20', '30', '40', '50']);
    const current = ref(1);
    const total = ref(100);
    const onShowSizeChange = (current: number, pageSize: number) => {
      console.log(current, pageSize);
    };
    return {
      pageSizeOptions,
      current,
      total,
      onShowSizeChange,
    };
  },
});
</script>
