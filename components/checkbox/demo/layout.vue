<docs>
---
order: 5
title:
  zh-CN: 布局
  en-US: Use with grid
---

## zh-CN

Checkbox.Group 内嵌 Checkbox 并与 Grid 组件一起使用，可以实现灵活的布局

## en-US

We can use Checkbox and Grid Checkbox.group, to implement complex layout

</docs>

<template>
  <a-checkbox-group v-model:value="value" style="width: 100%">
    <a-row>
      <a-col :span="8">
        <a-checkbox value="A">A</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="B">B</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="C">C</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="D">D</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="E">E</a-checkbox>
      </a-col>
    </a-row>
  </a-checkbox-group>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref([]);
</script>
