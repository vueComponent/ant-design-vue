<docs>
---
order: 10
title:
  zh-CN: 导航步骤
  en-US: Navigation Steps
---

## zh-CN

导航类型的步骤条。

## en-US

Navigation steps.
</docs>

<template>
  <div>
    <a-steps
      v-model:current="current"
      type="navigation"
      size="small"
      :style="stepStyle"
      :items="[
        {
          title: 'Step 1',
          subTitle: '00:00:05',
          status: 'finish',
          description: 'This is a description.',
        },
        {
          title: 'Step 2',
          subTitle: '00:01:02',
          status: 'process',
          description: 'This is a description.',
        },
        {
          title: 'Step 3',
          subTitle: 'waiting for longlong time',
          status: 'wait',
          description: 'This is a description.',
        },
      ]"
    ></a-steps>
    <a-steps
      v-model:current="current"
      type="navigation"
      :style="stepStyle"
      :items="[
        {
          status: 'finish',
          title: 'Step 1',
        },
        {
          status: 'process',
          title: 'Step 2',
        },
        {
          status: 'wait',
          title: 'Step 3',
        },
        {
          status: 'wait',
          title: 'Step 4',
        },
      ]"
    ></a-steps>
    <a-steps
      v-model:current="current"
      type="navigation"
      size="small"
      :style="stepStyle"
      :items="[
        {
          status: 'finish',
          title: 'finish 1',
        },
        {
          status: 'finish',
          title: 'finish 2',
        },
        {
          status: 'process',
          title: 'current process',
        },
        {
          status: 'wait',
          title: 'wait',
          disabled: true,
        },
      ]"
    ></a-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(0);

const stepStyle = {
  marginBottom: '60px',
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
};
</script>
