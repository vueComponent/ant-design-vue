<docs>
---
order: 2
title:
  zh-CN: 设置间隙
  en-US: gap
---

## zh-CN

使用 `gap` 设置元素之间的间距，预设了 `small`、`middle`、`large` 三种尺寸，也可以自定义间距。

## en-US

Set the `gap` between elements, which has three preset sizes: `small`, `middle`, `large`, You can also customize the gap size.

</docs>

<template>
  <a-flex gap="middle" vertical>
    <a-radio-group v-model:value="gapSize">
      <a-radio value="small">small</a-radio>
      <a-radio value="middle">middle</a-radio>
      <a-radio value="large">large</a-radio>
      <a-radio value="customize">customize</a-radio>
    </a-radio-group>
    <template v-if="gapSize === 'customize'">
      <a-slider v-model:value="customGapSize" />
    </template>
    <a-flex :gap="gapSize !== 'customize' ? gapSize : customGapSize">
      <a-button type="primary">Primary</a-button>
      <a-button>Default</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="link">Link</a-button>
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type SizeType = 'small' | 'middle' | 'large' | undefined;

const gapSize = ref<SizeType | 'customize'>('small');

const customGapSize = ref<number>(0);
</script>
