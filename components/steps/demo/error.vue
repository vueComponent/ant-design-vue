<docs>
---
order: 6
title:
  zh-CN: 步骤运行错误
  en-US: Error status
---

## zh-CN

使用 Steps 的 `status` 属性来指定当前步骤的状态。

## en-US

By using `status` of `Steps`, you can specify the state for current step.
</docs>
<template>
  <a-steps
    v-model:current="current"
    status="error"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Process',
        description,
      },
      {
        title: 'Waiting',
        description,
      },
    ]"
  ></a-steps>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(1);
const description = 'This is a description.';
</script>
