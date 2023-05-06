<docs>
---
order: 2
title:
  zh-CN: 改变
  en-US: Changer
---

## zh-CN

改变每页显示条目数。

## en-US

Change `pageSize`.
</docs>

<template>
  <div>
    <a-pagination
      v-model:current="current1"
      v-model:pageSize="pageSize"
      show-size-changer
      :total="500"
      @showSizeChange="onShowSizeChange"
    />
    <br />
    <a-pagination
      v-model:current="current2"
      show-size-changer
      :total="500"
      disabled
      @showSizeChange="onShowSizeChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const pageSize = ref(20);
const current1 = ref(3);
const current2 = ref(4);
const onShowSizeChange = (current: number, pageSize: number) => {
  console.log(current, pageSize);
};
watch(pageSize, () => {
  console.log('pageSize', pageSize.value);
});
watch(current1, () => {
  console.log('current', current1.value);
});
</script>
