<docs>
---
order: 4
title:
  zh-CN: 事件
  en-US: Event
---

## zh-CN

当 Slider 的值发生改变时，会触发 `onChange` 事件，并把改变后的值作为参数传入。在 `onmouseup` 时，会触发 `onAfterChange` 事件，并把当前值作为参数传入。

## en-US

The `onChange` callback function will fire when the user changes the slider's value. The `onAfterChange` callback function will fire when `onmouseup` fired.
</docs>

<template>
  <div class="code-box-demo">
    <a-slider v-model:value="value1" @change="onChange" @afterChange="onAfterChange" />
    <a-slider v-model:value="value2" range :step="10" @change="onChange" @afterChange="onAfterChange" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(30);
const value2 = ref<[number, number]>([20, 50]);

const onChange = (value: number) => {
  console.log('onChange: ', value);
};

const onAfterChange = (value: number) => {
  console.log('afterChange: ', value);
};
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
