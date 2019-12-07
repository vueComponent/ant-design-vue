<cn>
#### 幽灵按钮
幽灵按钮将其他按钮的内容反色，背景变为透明，常用在有色背景上。
</cn>

<us>
#### Ghost Button
`ghost` property will make button's background transparent, it is common used in colored background.
</us>

```tpl
<template>
  <div :style="{ background: 'rgb(190, 200, 200)', padding: '26px 16px 16px' }">
    <a-button type="primary" ghost>Primary</a-button>
    <a-button ghost>Default</a-button>
    <a-button type="dashed" ghost>Dashed</a-button>
    <a-button type="danger" ghost>Danger</a-button>
    <a-button type="link" ghost>Link</a-button>
  </div>
</template>
```
