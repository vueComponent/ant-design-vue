<cn>
#### 垂直间距
相邻组件垂直间距。
可以设置 `width: 100%` 独占一行。
</cn>

<us>
#### Vertical Space
Crowded components vertical spacing.
Can set `width: 100%` fill a row.
</us>

```vue
<template>
  <a-space direction="vertical">
    <a-card title="Card" style="width: 300px;">
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
    <a-card title="Card" style="width: 300px;">
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
  </a-space>
</template>
<script>
export default {};
</script>
```
