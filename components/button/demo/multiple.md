<cn>
#### 多个按钮组合
按钮组合使用时，推荐使用1个主操作 + n 个次操作，3个以上操作时把更多操作放到 `Dropdown.Button` 中组合使用。
</cn>

<us>
#### Multiple Buttons
If you need several buttons, we recommend that you use 1 primary button + n secondary buttons, and if there are more than three operations, you can group some of them into `Dropdown.Button`.
</us>

```html
// TODO: 依赖组件开发中
<template>
  <div>
    <a-button type="primary">Primary</a-button>
    <a-button>Default</a-button>
    <a-button type="dashed">Dashed</a-button>
    <a-button type="danger">Danger</a-button>
  </div>
</template>
```
