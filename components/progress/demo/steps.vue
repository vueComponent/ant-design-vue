<docs>
---
order: 12
title:
  zh-CN: 步骤进度条
  en-US: Progress bar with steps
---

## zh-CN

带步骤的进度条。

## en-US

A progress bar with steps.

</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-progress :percent="50" :steps="3" />
    <a-progress :percent="30" :steps="5" />
    <a-progress :percent="100" :steps="5" size="small" stroke-color="#52c41a" />
    <a-progress :percent="60" :steps="5" :stroke-color="['#52c41a', '#52c41a', '#f5222d']" />
  </a-space>
</template>
