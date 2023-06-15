<docs>
---
order: 1
title:
  zh-CN: 静态位置
  en-US: Static
---

## zh-CN

不浮动，状态不随页面滚动变化。

## en-US

Do not change state when page is scrolling.
</docs>

<template>
  <a-anchor
    :affix="false"
    :items="[
      {
        key: '1',
        href: '#components-anchor-demo-basic',
        title: 'Basic demo',
      },
      {
        key: '2',
        href: '#components-anchor-demo-static',
        title: 'Static demo',
      },
      {
        key: '3',
        href: '#api',
        title: 'API',
        children: [
          {
            key: '4',
            href: '#anchor-props',
            title: 'Anchor Props',
          },
          {
            key: '5',
            href: '#link-props',
            title: 'Link Props',
          },
        ],
      },
    ]"
  ></a-anchor>
</template>
