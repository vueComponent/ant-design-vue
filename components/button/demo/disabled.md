<cn>
#### 不可用状态
添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。
</cn>

<us>
#### Disabled
To mark a button as disabled, add the `disabled` property to the `Button`.
</us>

```tpl
<template>
  <div>
    <a-button type="primary">Primary</a-button>
    <a-button type="primary" disabled>Primary(disabled)</a-button>
    <br />
    <a-button>Default</a-button>
    <a-button disabled>Default(disabled)</a-button>
    <br />
    <a-button type="dashed">Dashed</a-button>
    <a-button type="dashed" disabled>Dashed(disabled)</a-button>
    <br />
    <a-button type="link">Link</a-button>
    <a-button type="link" disabled>Link(disabled)</a-button>
    <div :style="{ padding: '8px 8px 0 8px', background: 'rgb(190, 200, 200)' }">
      <a-button ghost>Ghost</a-button>
      <a-button ghost disabled>Ghost(disabled)</a-button>
    </div>
  </div>
</template>
```
