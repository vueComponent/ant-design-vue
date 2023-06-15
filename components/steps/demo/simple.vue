<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic
---

## zh-CN

简单的步骤条。

## en-US

The most basic step bar.
</docs>
<template>
  <a-steps
    :current="1"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
        description,
        subTitle: 'Left 00:00:08',
      },
      {
        title: 'Waiting',
        description,
      },
    ]"
  ></a-steps>
</template>
<script lang="ts" setup>
const description = 'This is a description.';
</script>
