<docs>
---
order: 9
title:
  zh-CN: 可点击
  en-US: Clickable
---

## zh-CN

设置 `v-model` 后，Steps 变为可点击状态。

## en-US

Setting `v-model` makes Steps clickable.
</docs>

<template>
  <div>
    <a-steps
      v-model:current="current"
      :items="[
        {
          title: 'Step 1',
          description,
        },
        {
          title: 'Step 2',
          description,
        },
        {
          title: 'Step 3',
          description,
        },
      ]"
    ></a-steps>
    <a-divider />
    <a-steps
      v-model:current="current"
      direction="vertical"
      :items="[
        {
          title: 'Step 1',
          description,
        },
        {
          title: 'Step 2',
          description,
        },
        {
          title: 'Step 3',
          description,
        },
      ]"
    ></a-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(0);
const description = 'This is a description.';
</script>
