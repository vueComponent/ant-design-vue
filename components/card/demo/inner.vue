<docs>
---
order: 5
title:
  zh-CN: 内部卡片
  en-US: Inner card
---

## zh-CN

可以放在普通卡片内部，展示多层级结构的信息

## en-US

It can be placed inside the ordinary card to display the information of the multilevel structure

</docs>

<template>
  <a-card title="Card title">
    <p style="font-size: 14px; color: rgba(0, 0, 0, 0.85); margin-bottom: 16px; font-weight: 500">
      Group title
    </p>
    <a-card title="Inner card title">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </a-card>
    <a-card title="Inner card title" :style="{ marginTop: '16px' }">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </a-card>
  </a-card>
</template>
