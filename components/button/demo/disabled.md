
<cn>
#### 不可用状态
添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。
</cn>

<us>
#### Disabled
To mark a button as disabled, add the `disabled` property to the `Button`.
</us>

```html
<template>
  <div>
    <a-button type="primary">Primary</a-button>
    <a-button type="primary" disabled>Primary(disabled)</a-button>
    <br />
    <a-button>Default</a-button>
    <a-button disabled>Default(disabled)</a-button>
    <br />
    <a-button>Ghost</a-button>
    <a-button disabled>Ghost(disabled)</a-button>
    <br />
    <a-button type="dashed">Dashed</a-button>
    <a-button type="dashed" disabled>Dashed(disabled)</a-button>
  </div>
</template>
```
