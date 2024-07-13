<docs>
---
order: 30
title:
  zh-CN: 最大选中数量
  en-US: Max Count
---

## zh-CN

你可以通过设置 `maxCount` 约束最多可选中的数量，当超出限制时会变成禁止选中状态。

## en-US

You can set the `maxCount` prop to control the max number of items can be selected. When the limit is exceeded, the options will become disabled.
</docs>
<template>
  <div>
    <a-select
      mode="multiple"
      :value="value"
      style="width: 100%"
      :show-arrow="true"
      :options="options"
      :max-count="MAX_COUNT"
      @change="setValue"
    >
      <template #suffixIcon>
        <span>{{ value.length }} / {{ MAX_COUNT }}</span>
        <DownOutlined />
      </template>
    </a-select>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

const MAX_COUNT = 3;
const options = [
  { value: 'Ava Swift', label: 'Ava Swift' },
  { value: 'Cole Reed', label: 'Cole Reed' },
  { value: 'Mia Blake', label: 'Mia Blake' },
  { value: 'Jake Stone', label: 'Jake Stone' },
  { value: 'Lily Lane', label: 'Lily Lane' },
  { value: 'Ryan Chase', label: 'Ryan Chase' },
  { value: 'Zoe Fox', label: 'Zoe Fox' },
  { value: 'Alex Grey', label: 'Alex Grey' },
  { value: 'Elle Blair', label: 'Elle Blair' },
];

type Value = (typeof options)[number]['value'];
const value = ref<Array<Value>>(['Ava Swift']);
const setValue = (val: Array<Value>) => {
  value.value = val;
};
</script>
