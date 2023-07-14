<docs>
---
order: 3
title:
  zh-CN: 自定义时间轴点
  en-US: Custom
---

## zh-CN

可以设置为图标或其他自定义元素。

## en-US

Set a node as an icon or other custom element.

</docs>

<template>
  <a-timeline>
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
    <a-timeline-item color="red">
      <template #dot><clock-circle-outlined style="font-size: 16px" /></template>
      Technical testing 2015-09-01
    </a-timeline-item>
    <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
  </a-timeline>
</template>
<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';
</script>
