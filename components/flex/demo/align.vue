<docs>
---
order: 1
title:
  zh-CN: 对齐方式
  en-US: Align
---

## zh-CN

设置对齐方式。

## en-US

Set align.

</docs>

<template>
  <a-flex gap="middle" align="start" vertical>
    <p>Select justify :</p>
    <a-segmented v-model:value="justify" :options="justifyOptions" />
    <p>Select align :</p>
    <a-segmented v-model:value="alignItems" :options="alignOptions" />
    <a-flex :style="{ ...boxStyle }" :justify="justify" :align="alignItems">
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { CSSProperties } from 'vue';
import type { FlexProps } from 'ant-design-vue';
const justifyOptions = reactive<FlexProps['justify'][]>([
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
]);

const alignOptions = reactive<FlexProps['align'][]>(['flex-start', 'center', 'flex-end']);
const justify = ref(justifyOptions[0]);
const alignItems = ref(alignOptions[0]);
const boxStyle: CSSProperties = {
  width: '100%',
  height: '120px',
  borderRadius: '6px',
  border: '1px solid #40a9ff',
};
</script>
