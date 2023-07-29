<docs>
---
order: 10
title:
  zh-CN: 栅格配置器
  en-US: Playground
---

## zh-CN

可以简单配置几种等分栅格和间距。

## en-US

A simple playground for column count and gutter.

</docs>

<template>
  <div id="components-grid-demo-playground">
    <div style="margin-bottom: 16px">
      <span style="margin-right: 6px">Horizontal Gutter (px):</span>
      <div style="width: 50%">
        <a-slider
          v-model:value="state.gutterKey"
          :min="0"
          :max="Object.keys(state.gutters).length - 1"
          :marks="state.gutters"
          :step="null"
        />
      </div>
      <span style="margin-right: 6px">Vertical Gutter (px):</span>
      <div style="width: 50%">
        <a-slider
          v-model:value="state.vgutterKey"
          :min="0"
          :max="Object.keys(state.vgutters).length - 1"
          :marks="state.vgutters"
          :step="null"
        />
      </div>
      <span style="margin-right: 6px">Column Count:</span>
      <div style="width: 50%">
        <a-slider
          v-model:value="state.colCountKey"
          :min="0"
          :max="Object.keys(state.colCounts).length - 1"
          :marks="state.colCounts"
          :step="null"
        />
      </div>
    </div>
    <a-row :gutter="[state.gutters[state.gutterKey], state.vgutters[state.vgutterKey]]">
      <a-col
        v-for="item in state.colCounts[state.colCountKey]"
        :key="item.toString()"
        :span="24 / state.colCounts[state.colCountKey]"
      >
        <div>Column</div>
      </a-col>
      <a-col
        v-for="item in state.colCounts[state.colCountKey]"
        :key="item.toString()"
        :span="24 / state.colCounts[state.colCountKey]"
      >
        <div>Column</div>
      </a-col>
    </a-row>
    Another Row:
    <a-row :gutter="[state.gutters[state.gutterKey], state.vgutters[state.vgutterKey]]">
      <a-col
        v-for="item in state.colCounts[state.colCountKey]"
        :key="item.toString()"
        :span="24 / state.colCounts[state.colCountKey]"
      >
        <div>Column</div>
      </a-col>
    </a-row>
    <pre>{{ rowColHtml }}</pre>
    <br />
    <pre>{{ rowColHtml }}</pre>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
const state = reactive<{
  gutterKey: number;
  vgutterKey: number;
  colCountKey: number;
  gutters: { [key: number]: number };
  colCounts: { [key: number]: number };
  vgutters: { [key: number]: number };
}>({
  gutterKey: 1,
  vgutterKey: 1,
  colCountKey: 2,
  gutters: {},
  colCounts: {},
  vgutters: {},
});
[8, 16, 24, 32, 40, 48].forEach((value: number, i: number) => {
  state.gutters[i] = value;
});
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
  state.vgutters[i] = value;
});
[2, 3, 4, 6, 8, 12].forEach((value, i) => {
  state.colCounts[i] = value;
});
const rowColHtml = computed(() => {
  const colCount = state.colCounts[state.colCountKey];
  const getter = [state.gutters[state.gutterKey], state.vgutters[state.vgutterKey]];
  let colCode = '<a-row :gutter="[' + getter + ']">\n';
  for (let i = 0; i < colCount; i++) {
    const spanNum = 24 / colCount;
    colCode += '  <a-col :span="' + spanNum + '"/>\n';
  }
  colCode += '</a-row>';
  return colCode;
});
</script>
<style scoped>
:deep(#components-grid-demo-playground) [class~='ant-col'] {
  background: transparent;
  border: 0;
}
:deep(#components-grid-demo-playground) [class~='ant-col'] > div {
  height: 120px;
  font-size: 14px;
  line-height: 120px;
  background: #0092ff;
  border-radius: 4px;
}
:deep(#components-grid-demo-playground) pre {
  padding: 8px 16px;
  font-size: 13px;
  background: #f9f9f9;
  border-radius: 6px;
}
:deep(#components-grid-demo-playground) pre.demo-code {
  direction: ltr;
}
:deep(#components-grid-demo-playground) .ant-col {
  padding: 0;
}
</style>
