<docs>
---
order: 8
debugger: true
title:
  zh-CN: 受控组件
  en-US: Under Control
---

## zh-CN

value 和 onChange 需要配合使用。也可以直接使用v-model。

## en-US

`value` and `@change` should be used together or use v-model.

</docs>

<template>
  <div>
    <p>use value and @change</p>
    <a-time-picker :value="value" @change="onChange" />
    <br />
    <br />
    <p>v-model</p>
    <a-time-picker v-model:value="value" />
    <br />
    <br />
    <p>Do not change</p>
    <a-time-picker :value="value2" />
  </div>
</template>
<script lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const value = ref<Dayjs>();

    const onChange = (time: Dayjs) => {
      console.log(time);
      value.value = time;
    };

    return {
      value,
      value2: ref(dayjs()),
      onChange,
    };
  },
});
</script>
