<docs>
---
order: 4
title:
  zh-CN: 跳转
  en-US: Jumper
---

## zh-CN

快速跳转到某一页。

## en-US

Jump to a page directly.
</docs>
<template>
  <div>
    <a-pagination v-model:current="current1" show-quick-jumper :total="500" @change="onChange" />
    <br />
    <a-pagination
      v-model:current="current2"
      show-quick-jumper
      :total="500"
      disabled
      show-less-items
      @change="onChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current1 = ref<number>(1);
const current2 = ref<number>(2);
const onChange = (pageNumber: number) => {
  console.log('Page: ', pageNumber);
};
</script>
