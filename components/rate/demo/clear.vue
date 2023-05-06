<docs>
---
order: 4
title:
  zh-CN: 清除
  en-US: Clear star
---

## zh-CN

支持允许或者禁用清除。

## en-US

Support set allow to clear star when click again.

</docs>
<template>
  <div>
    <a-rate v-model:value="value1" />
    <span class="ant-rate-text">allowClear: true</span>
    <br />
    <a-rate v-model:value="value2" :allow-clear="false" />
    <span class="ant-rate-text">allowClear: false</span>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(3);
const value2 = ref<number>(3);
</script>
