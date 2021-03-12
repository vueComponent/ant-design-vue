<cn>
#### 带图标的步骤条
通过设置 `Steps.Step` 的 `icon` 属性，可以启用自定义图标。
</cn>

<us>
#### With icon
You can use your own custom icons by setting the property `icon` for `Steps.Step`.
</us>

```vue
<template>
  <a-steps>
    <a-step status="finish" title="Login">
      <a-icon slot="icon" type="user" />
    </a-step>
    <a-step status="finish" title="Verification">
      <a-icon slot="icon" type="solution" />
    </a-step>
    <a-step status="process" title="Pay">
      <a-icon slot="icon" type="loading" />
    </a-step>
    <a-step status="wait" title="Done">
      <a-icon slot="icon" type="smile-o" />
    </a-step>
  </a-steps>
</template>
```
