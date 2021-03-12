<cn>
#### 迷你
迷你版本。
</cn>

<us>
#### Mini size
Mini size pagination.
</us>

```vue
<template>
  <div id="components-pagination-demo-mini">
    <a-pagination size="small" :total="50" />
    <a-pagination size="small" :total="50" show-size-changer show-quick-jumper />
    <a-pagination size="small" :total="50" :show-total="total => `Total ${total} items`" />
  </div>
</template>
<style scoped>
#components-pagination-demo-mini .ant-pagination:not(:last-child) {
  margin-bottom: 24px;
}
</style>
```
