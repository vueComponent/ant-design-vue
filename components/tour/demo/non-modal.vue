<docs>
---
order: 1
title:
  zh-CN: 非模态
  en-US: Non modal
---

## zh-CN

使用 `mask={false}` 可以将引导变为非模态，同时为了强调引导本身，建议与 `type="primary"` 组合使用。

## en-US

Use `mask={false}` to make Tour non-modal. At the meantime it is recommended to use with `type="primary"` to emphasize the guide itself.
  
    
</docs>

<template>
  <a-button type="primary" @click="handleOpen(true)">Begin Tour</a-button>

  <a-divider />

  <a-space>
    <a-button ref="ref1">Upload</a-button>
    <a-button ref="ref2" type="primary">Save</a-button>
    <a-button ref="ref3"><EllipsisOutlined /></a-button>
  </a-space>

  <a-tour :open="open" :mask="false" type="primary" :steps="steps" @close="handleOpen(false)" />
</template>

<script lang="ts" setup>
import { ref, createVNode } from 'vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import type { TourProps } from 'ant-design-vue';
const open = ref<boolean>(false);

const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);

const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    cover: createVNode('img', {
      alt: 'tour.png',
      src: 'https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png',
    }),
    target: () => ref1.value && ref1.value.$el,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => ref2.value && ref2.value.$el,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: () => ref3.value && ref3.value.$el,
  },
];

const handleOpen = (val: boolean): void => {
  open.value = val;
};
</script>
