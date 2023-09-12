<docs>
---
order: 4
title:
  zh-CN: 状态点
  en-US: Status
---

## zh-CN

用于表示状态的小圆点。

## en-US

Standalone badge with status.
</docs>

<template>
  <a-badge status="success" />
  <a-badge status="error" />
  <a-badge status="default" />
  <a-badge status="processing" />
  <a-badge status="warning" />
  <br />

  <a-space direction="vertical">
    <a-badge status="success" text="Success" />
    <a-badge status="error" text="Error" />
    <a-badge status="default" text="Default" />
    <a-badge status="processing" text="Processing" />
    <a-badge status="warning" text="warning" />
  </a-space>
</template>
