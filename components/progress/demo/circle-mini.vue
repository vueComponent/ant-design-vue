<docs>
---
order: 3
title:
  zh-CN: 小型进度圈
  en-US: Mini size circular progress bar
---

## zh-CN

小一号的圈形进度。

## en-US

A smaller circular progress bar.

</docs>

<template>
  <a-progress type="circle" :percent="30" :size="80" />
  <a-progress type="circle" :percent="70" :size="80" status="exception" />
  <a-progress type="circle" :percent="100" :size="80" />
</template>
