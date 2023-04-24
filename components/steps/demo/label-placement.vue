<docs>
---
order: 5
title:
  zh-CN: 标签放置位置
  en-US: Label Placement
---

## zh-CN

修改标签放置位置为 `vertical`。

## en-US

Set labelPlacement to `vertical`.

</docs>
<template>
  <div>
    <a-steps :current="1" label-placement="vertical" :items="items" />
    <br />
    <a-steps :current="1" :percent="60" label-placement="vertical" :items="items" />
    <br />
    <a-steps :current="1" size="small" label-placement="vertical" :items="items" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const items = ref([
  {
    title: 'Finished',
    description: 'This is a description.',
  },
  {
    title: 'In Progress',
    description: 'This is a description.',
  },
  {
    title: 'Waiting',
    description: 'This is a description.',
  },
]);
</script>
