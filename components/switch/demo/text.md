<cn>
#### 文字和图标
带有文字和图标。
</cn>

<us>
#### Text & icon
With text and icon.
</us>

```tpl
<template>
  <div>
    <a-switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
    <br />
    <a-switch checkedChildren="1" unCheckedChildren="0" />
    <br />
    <a-switch defaultChecked>
      <a-icon type="check" slot="checkedChildren" />
      <a-icon type="close" slot="unCheckedChildren" />
    </a-switch>
  </div>
</template>
```
