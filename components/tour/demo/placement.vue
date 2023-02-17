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
  <a-button @click="visible = true">Begin Tour</a-button>
  <a-divider />
  <a-space>
    <a-button :ref="ref1">Upload</a-button>
    <a-button :ref="ref2" type="primary">Save</a-button>
    <a-button :ref="ref3">
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
    const ref1 = ref(null);
    const ref2 = ref(null);
    const ref3 = ref(null);

    const visible = ref(false);

    const steps = [
      {
        title: 'Upload File',
        description: 'Put your files here',
        target: () => ref1,
      },
      {
        title: 'Save',
        description: 'Save your changes.',
        target: () => ref2,
      },
      {
        title: 'Other Actions',
        description: 'Click to see other actions.',
        target: () => ref3,
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
