<docs>
---
order: 3
title:
  zh-CN: 不可用状态
  en-US: Disabled
---

## zh-CN

添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。

## en-US

To mark a button as disabled, add the `disabled` property to the `Button`.
</docs>

<template>
  <a-space direction="vertical">
    <a-space>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary" disabled>Primary(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button>Default</a-button>
      <a-button disabled>Default(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="dashed" disabled>Dashed(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button type="text">Text</a-button>
      <a-button type="text" disabled>Text(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button type="link">Link</a-button>
      <a-button type="link" disabled>Link(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button danger>Danger Default</a-button>
      <a-button danger disabled>Danger Default(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button danger type="text">Danger Text</a-button>
      <a-button danger type="text" disabled>Danger Text(disabled)</a-button>
    </a-space>
    <a-space>
      <a-button danger type="link">Danger Link</a-button>
      <a-button danger type="link" disabled>Danger Link(disabled)</a-button>
    </a-space>
    <div :style="{ padding: '8px', background: 'rgb(190, 200, 200)' }">
      <a-space>
        <a-button ghost>Ghost</a-button>
        <a-button ghost disabled>Ghost(disabled)</a-button>
      </a-space>
    </div>
  </a-space>
</template>
