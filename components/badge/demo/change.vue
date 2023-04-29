<docs>
---
order: 5
title:
  zh-CN: 动态
  en-US: Dynamic
---

## zh-CN

展示动态变化的效果。

## en-US

The count will be animated as it changes.
</docs>

<template>
  <div>
    <a-badge :count="count">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-button-group>
      <a-button @click="decline">
        <minus-outlined />
      </a-button>
      <a-button @click="increase">
        <plus-outlined />
      </a-button>
    </a-button-group>
  </div>
  <a-divider />
  <a-badge :dot="show">
    <a-avatar shape="square" size="large" />
  </a-badge>
  <a-switch v-model:checked="show" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
const count = ref<number>(5);
const show = ref<boolean>(true);
const decline = () => {
  if (count.value >= 1) {
    count.value--;
  }
};

const increase = () => {
  count.value++;
};
</script>
