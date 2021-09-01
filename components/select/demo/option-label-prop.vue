<docs>
---
order: 14
title:
  zh-CN: 定制回填内容
  en-US: Custom selection render
---

## zh-CN

使用 `optionLabelProp` 指定回填到选择框的 `Option` 属性。

## en-US

Spacified the prop name of Option which will be rendered in select box.

</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="select one country"
      option-label-prop="label"
    >
      <a-select-option value="china" label="China">
        <span role="img" aria-label="China">🇨🇳</span>
        &nbsp;&nbsp;China (中国)
      </a-select-option>
      <a-select-option value="usa" label="USA">
        <span role="img" aria-label="USA">🇺🇸</span>
        &nbsp;&nbsp;USA (美国)
      </a-select-option>
      <a-select-option value="japan" label="Japan">
        <span role="img" aria-label="Japan">🇯🇵</span>
        &nbsp;&nbsp;Japan (日本)
      </a-select-option>
      <a-select-option value="korea" label="Korea">
        <span role="img" aria-label="Korea">🇰🇷</span>
        &nbsp;&nbsp;Korea (韩国)
      </a-select-option>
    </a-select>

    <a-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      placeholder="select one country"
      option-label-prop="label"
      :options="options"
    >
      <template #option="{ value: val, label, icon }">
        <span role="img" :aria-label="val">{{ icon }}</span>
        &nbsp;&nbsp;{{ label }}
      </template>
    </a-select>
    <span>Note: v-slot:option support from v2.2.5</span>
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  setup() {
    const value = ref(['china']);

    const options = ref([
      {
        value: 'china',
        label: 'China (中国)',
        icon: '🇨🇳',
      },
      {
        value: 'usa',
        label: 'USA (美国)',
        icon: '🇺🇸',
      },
      {
        value: 'japan',
        label: 'Japan (日本)',
        icon: '🇯🇵',
      },
      {
        value: 'korea',
        label: 'Korea (韩国)',
        icon: '🇨🇰',
      },
    ]);
    watch(value, val => {
      console.log(`selected:`, val);
    });

    return {
      options,
      value,
    };
  },
});
</script>
