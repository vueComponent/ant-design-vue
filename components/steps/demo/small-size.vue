<docs>
---
order: 1
title:
  zh-CN: 迷你版
  en-US: Mini version
---

## zh-CN

迷你版的步骤条，通过设置 `<Steps size="small">` 启用.

## en-US

By setting like this: `<Steps size="small">`, you can get a mini version.
</docs>
<template>
  <a-steps
    :current="1"
    size="small"
    :items="[
      {
        title: 'Finished',
      },
      {
        title: 'In Progress',
      },
      {
        title: 'Waiting',
      },
    ]"
  ></a-steps>
</template>
