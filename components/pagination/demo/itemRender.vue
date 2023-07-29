<docs>
---
order: 8
title:
  zh-CN: 上一步和下一步
  en-US: Prev and next
---

## zh-CN

修改上一步和下一步为文字链接。

## en-US

Use text link for prev and next button.
</docs>

<template>
  <a-pagination v-model:current="current" :total="500">
    <template #itemRender="{ type, originalElement }">
      <a v-if="type === 'prev'">Previous</a>
      <a v-else-if="type === 'next'">Next</a>
      <component :is="originalElement" v-else></component>
    </template>
  </a-pagination>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref(1);
</script>
