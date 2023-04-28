<docs>
---
order: 2
title:
  zh-CN: 渐显
  en-US: Fade in
---

## zh-CN

切换效果为渐显。

## en-US

Slides use fade for transition.

</docs>

<template>
  <a-carousel effect="fade">
    <div><h3>1</h3></div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </a-carousel>
</template>

<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>
