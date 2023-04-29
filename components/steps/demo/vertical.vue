<docs>
---
order: 4
title:
  zh-CN: 竖直方向的步骤条
  en-US: Vertical
---

## zh-CN

简单的竖直方向的步骤条。

## en-US

A simple step bar in the vertical direction.
</docs>

<template>
  <a-steps
    direction="vertical"
    :current="1"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
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
const description = 'This is a description.';
</script>
