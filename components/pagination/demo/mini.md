
<cn>
#### 迷你
迷你版本。
</cn>

<us>
#### Mini size
Mini size pagination.
</us>

```html
<template>
  <div>
    <a-pagination size="small" :total="50" />
    <a-pagination size="small" :total="50" showSizeChanger showQuickJumper />
    <a-pagination size="small" :total="50" :showTotal="total => `Total ${total} items`" />
  </div>
</template>
<style scoped>
.ant-select {
  margin-bottom: 0 !important;
}
.code-box-demo .ant-pagination:not(:last-child) {
  margin-bottom: 24px;
}
</style>
```

