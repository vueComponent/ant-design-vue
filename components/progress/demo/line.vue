<docs>
---
order: 0
title:
  zh-CN: 进度条
  en-US: Progress bar
---

## zh-CN

标准的进度条。

## en-US

A standard progress bar.

</docs>

<template>
  <a-progress :percent="30" />
  <a-progress :percent="50" status="active" />
  <a-progress :percent="70" status="exception" />
  <a-progress :percent="100" />
  <a-progress :percent="50" :show-info="false" />
</template>
