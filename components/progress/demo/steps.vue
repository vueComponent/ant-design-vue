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
  <a-progress :percent="50" :steps="3" />
  <br />
  <a-progress :percent="30" :steps="5" />
  <br />
  <a-progress :percent="100" :steps="5" size="small" stroke-color="#52c41a" />
</template>
