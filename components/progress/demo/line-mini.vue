<docs>
---
order: 2
title:
  zh-CN: 小型进度条
  en-US: Mini size progress bar
---

## zh-CN

适合放在较狭窄的区域内。

## en-US

Appropriate for a narrow area.

</docs>

<template>
  <div style="width: 170px">
    <a-progress :percent="30" size="small" />
    <a-progress :percent="50" size="small" status="active" />
    <a-progress :percent="70" size="small" status="exception" />
    <a-progress :percent="100" size="small" />
  </div>
</template>
