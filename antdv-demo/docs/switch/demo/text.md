<cn>
#### 文字和图标
带有文字和图标。
</cn>

<us>
#### Text & icon
With text and icon.
</us>

```vue
<template>
  <div>
    <a-switch checked-children="开" un-checked-children="关" default-checked />
    <br />
    <a-switch checked-children="1" un-checked-children="0" />
    <br />
    <a-switch default-checked>
      <a-icon slot="checkedChildren" type="check" />
      <a-icon slot="unCheckedChildren" type="close" />
    </a-switch>
  </div>
</template>
```
