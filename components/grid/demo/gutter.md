<cn>
#### 区块间隔
栅格常常需要和间隔进行配合，你可以使用 `Row` 的 `gutter` 属性，我们推荐使用 `(16+8n)px` 作为栅格间隔。(n 是自然数)
如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`。
</cn>

<us>
#### Grid Gutter
You can use the `gutter` property of `Row` as grid spacing, we recommend set it to `(16 + 8n) px`. (`n` stands for natural number.)
You can set it to a object like `{ xs: 8, sm: 16, md: 24, lg: 32 }` for responsive design.
</us>

```tpl
<template>
  <div class="gutter-example">
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">col-6</div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">col-6</div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">col-6</div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">col-6</div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
  .gutter-example >>> .ant-row > div {
    background: transparent;
    border: 0;
  }
  .gutter-box {
    background: #00a0e9;
    padding: 5px 0;
  }
</style>
```
