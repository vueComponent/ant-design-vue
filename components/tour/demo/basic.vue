<docs>
---
order: 0
title:
zh-CN: 基本
en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The most basic usage.
</docs>

<template>
  <a-button @click="visible = true">Begin Tour</a-button>
  <a-divider />
  <a-space>
    <a-button ref="ref1">Upload</a-button>
    <a-button ref="ref2" type="primary">Save</a-button>
    <a-button ref="ref3">
      <template #icon>
        <EllipsisOutlined />
      </template>
    </a-button>
  </a-space>
  <a-tour v-model:visible="visible" :steps="steps" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    EllipsisOutlined,
  },
  setup() {
    const ref1 = ref<HTMLElement>();
    const ref2 = ref<HTMLElement>();
    const ref3 = ref<HTMLElement>();

    const visible = ref<boolean>(false);

    const steps = [
      {
        title: 'Upload File',
        description: 'Put your files here',
        target: () => ref1.value,
      },
      {
        title: 'Save',
        description: 'Save your changes.',
        target: () => ref2.value,
      },
      {
        title: 'Other Actions',
        description: 'Click to see other actions.',
        target: () => ref3.value,
      },
    ];
    return {
      ref1,
      ref2,
      ref3,
      visible,
      steps,
    };
  },
});
</script>
