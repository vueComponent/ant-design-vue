<docs>
---
order: 0
title:
  zh-CN: 操作
  en-US: Action
---

## zh-CN

可以在右上角自定义操作项。

## en-US

Custom action.

</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-alert message="Success Tips" type="success" show-icon closable>
      <template #action>
        <a-button size="small" type="text">UNDO</a-button>
      </template>
    </a-alert>
    <a-alert
      message="Error Text"
      show-icon
      description="Error Description Error Description Error Description Error Description"
      type="error"
    >
      <template #action>
        <a-button size="small" danger>Detail</a-button>
      </template>
    </a-alert>
    <a-alert message="Warning Text" type="warning" closable>
      <template #action>
        <a-space>
          <a-button size="small" type="ghost">Done</a-button>
        </a-space>
      </template>
    </a-alert>
    <a-alert
      message="Info Text"
      description="Info Description Info Description Info Description Info Description"
      type="info"
      closable
    >
      <template #action>
        <a-space direction="vertical">
          <a-button size="small" type="primary">Accept</a-button>
          <a-button size="small" danger type="ghost">Decline</a-button>
        </a-space>
      </template>
    </a-alert>
  </a-space>
</template>
