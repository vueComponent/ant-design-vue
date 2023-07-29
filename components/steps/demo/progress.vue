<docs>
---
order: 13
title:
  zh-CN: 带有进度的步骤
  en-US: Steps with progress
---

## zh-CN

带有进度的步骤。

## en-US

Steps with progress.

</docs>

<template>
  <a-steps
    v-model:current="current"
    :percent="60"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
        subTitle: 'Left 00:00:08',
        description,
      },
      {
        title: 'Waiting',
        description,
      },
    ]"
  ></a-steps>
  <a-steps
    v-model:current="current"
    :percent="60"
    size="small"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
        subTitle: 'Left 00:00:08',
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
