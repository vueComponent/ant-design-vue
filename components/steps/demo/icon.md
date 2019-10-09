<cn>
#### 带图标的步骤条
通过设置 `Steps.Step` 的 `icon` 属性，可以启用自定义图标。
</cn>

<us>
#### With icon
You can use your own custom icons by setting the property `icon` for `Steps.Step`.
</us>

```tpl
<template>
  <a-steps>
    <a-step status="finish" title="Login">
      <a-icon type="user" slot="icon" />
    </a-step>
    <a-step status="finish" title="Verification">
      <a-icon type="solution" slot="icon" />
    </a-step>
    <a-step status="process" title="Pay">
      <a-icon type="loading" slot="icon" />
    </a-step>
    <a-step status="wait" title="Done">
      <a-icon type="smile-o" slot="icon" />
    </a-step>
  </a-steps>
</template>
```
