<docs>
---
order: 4
title:
  zh-CN: 自定义面板
  en-US: Custom Panel
---

## zh-CN

自定义各个面板的背景色、圆角、边距和图标。

## en-US

Customize the background, border and margin styles and icon for each panel.

</docs>

<template>
  <a-collapse
    v-model:activeKey="activeKey"
    :bordered="false"
    style="background: rgb(255, 255, 255)"
  >
    <template #expandIcon="{ isActive }">
      <caret-right-outlined :rotate="isActive ? 90 : 0" />
    </template>
    <a-collapse-panel key="1" header="This is panel header 1" :style="customStyle">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="This is panel header 2" :style="customStyle">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="This is panel header 3" :style="customStyle">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const activeKey = ref(['1']);
const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
const customStyle =
  'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden';
</script>
