<docs>
---
order: 3
title:
  zh-CN: 无效或只读
  en-US: disabled or readonly
---

## zh-CN

通过 `disabled` 属性设置是否生效。通过 `readonly` 属性设置是否只读。

## en-US

Configurate disabled and readonly.

</docs>
<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-mentions
        v-model:value="value1"
        :options="options"
        placeholder="this is disabled Mentions"
        disabled
      ></a-mentions>
    </div>
    <a-mentions
      v-model:value="value2"
      :options="options"
      placeholder="this is readOnly a-mentions"
      readonly
    ></a-mentions>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<string>('');
const value2 = ref<string>('');
const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
