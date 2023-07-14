<docs>
---
order: 6
title:
  zh-CN: 无边框
  en-US: Borderless
---

## zh-CN

没有边框。

## en-US

No border.

</docs>

<template>
  <div>
    <a-input-number id="inputNumber" v-model:value="value" :bordered="false" :min="1" :max="10" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
</script>
