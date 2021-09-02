<docs>
---
order: 4
title:
  zh-CN: 多彩文字提示
  en-US: Colorful Tooltip
---

## zh-CN

我们添加了多种预设色彩的文字提示样式，用作不同场景使用。

## en-US

We preset a series of colorful Tooltip styles for use in different situations.

</docs>

<template>
  <div id="components-a-tooltip-demo-color">
    <a-divider orientation="left">Presets</a-divider>
    <div>
      <a-tooltip v-for="color in colors" :key="color" title="prompt text" :color="color">
        <a-button>{{ color }}</a-button>
      </a-tooltip>
    </div>
    <a-divider orientation="left">Custom</a-divider>
    <div>
      <a-tooltip v-for="color in customColors" :key="color" title="prompt text" :color="color">
        <a-button>{{ color }}</a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];
const customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
export default defineComponent({
  setup() {
    return {
      colors,
      customColors,
    };
  },
});
</script>

<style scoped>
#components-a-tooltip-demo-color .ant-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
