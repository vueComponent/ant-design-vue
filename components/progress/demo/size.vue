<docs>
---
order: 11
title:
  zh-CN: 进度条尺寸
  en-US: Progress bar size
---

## zh-CN

进度条尺寸。

## en-US

The size of progress.

</docs>

<template>
  <div>
    <a-space direction="vertical" style="width: 50%">
      <a-progress :percent="50" />
      <a-progress :percent="50" size="small" />
      <a-progress :percent="50" :size="[300, 20]" />
    </a-space>
    <br />
    <br />
    <a-space :size="30">
      <a-progress type="circle" :percent="50" />
      <a-progress type="circle" :percent="50" size="small" />
      <a-progress type="circle" :percent="50" :size="20" />
    </a-space>
    <br />
    <br />
    <a-space :size="30">
      <a-progress type="dashboard" :percent="50" />
      <a-progress type="dashboard" :percent="50" size="small" />
      <a-progress type="dashboard" :percent="50" :size="20" />
    </a-space>
    <br />
    <br />
    <a-space :size="30">
      <a-progress :steps="3" :percent="50" />
      <a-progress :steps="3" :percent="50" size="small" />
      <a-progress :steps="3" :percent="50" :size="20" />
      <a-progress :steps="3" :percent="50" :size="[20, 30]" />
    </a-space>
  </div>
</template>
