<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础分页。

## en-US

Basic pagination.

</docs>

<template>
  <a-pagination v-model:current="current" :total="50" show-less-items />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      current: ref(2),
    };
  },
});
</script>
