<cn>
#### 样式自定义
测试一些 `style` 修改样式的行为。
</cn>

<us>
#### Style Customization
Use `style` to change default style.
</us>

```vue
<template>
  <div>
    <a-divider style="height: 2px; background-color: #7cb305" />
    <a-divider style="border-color: #7cb305" dashed />
    <a-divider type="vertical" style="height: 60px; background-color: #7cb305" />
    <a-divider type="vertical" style="height: 60px; border-color: #7cb305" dashed />
  </div>
</template>
```
