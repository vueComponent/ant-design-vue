<docs>
---
order: 2
title:
  zh-CN: 位置
  en-US: Placement
---
  
## zh-CN

改变引导相对于目标的位置，共有 12 种位置可供选择。当 `target={null}` 时引导将会展示在正中央。

## en-US

Change the placement of the guide relative to the target, there are 12 placements available. When `target={null}` the guide will show in the center.

    
</docs>

<template>
  <a-button ref="btnRef" type="primary" @click="handleOpen(true)">Begin Tour</a-button>

  <a-tour :open="open" :steps="steps" @close="handleOpen(false)" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TourProps } from 'ant-design-vue';

const open = ref<boolean>(false);

const btnRef = ref(null);

const steps: TourProps['steps'] = [
  {
    title: 'Center',
    description: 'Displayed in the center of screen.',
    target: null,
  },
  {
    title: 'Right',
    description: 'On the right of target.',
    placement: 'right',
    target: () => btnRef.value && btnRef.value.$el,
  },
  {
    title: 'Top',
    description: 'On the top of target.',
    placement: 'top',
    target: () => btnRef.value && btnRef.value.$el,
  },
];

const handleOpen = (val: boolean): void => {
  open.value = val;
};
</script>
