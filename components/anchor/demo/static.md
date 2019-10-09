<cn>
#### 静态位置
不浮动，状态不随页面滚动变化。
</cn>

<us>
#### Static Anchor
Do not change state when page is scrolling.
</us>

```tpl
<template>
  <a-anchor :affix="false">
    <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo" />
    <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
    <a-anchor-link href="#API" title="API">
      <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
      <a-anchor-link href="#Link-Props" title="Link Props" />
    </a-anchor-link>
  </a-anchor>
</template>
```
