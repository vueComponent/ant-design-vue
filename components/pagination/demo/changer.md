
<cn>
#### 改变
改变每页显示条目数。
</cn>

<us>
#### Changer
Change `pageSize`.
</us>

```html
<template>
  <a-pagination showSizeChanger @showSizeChange="onShowSizeChange" :defaultCurrent="3" :total="500" />
</template>
<script>
  export default {
    methods: {
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
      }
    }
  }
</script>
<style scoped>
  .ant-select {
    margin-bottom: 0 !important;
  }
</style>
```

