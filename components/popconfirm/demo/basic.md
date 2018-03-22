<cn>
#### 基本
最简单的用法。
</cn>

<us>
#### Basic
The basic example.
</us>

```html
<template>
  <a-popconfirm title="Are you sure delete this task?" @confirm="confirm" @cancel="cancel" okText="Yes" cancelText="No">
    <a href="#">Delete</a>
  </a-popconfirm>
</template>
<script>
import { message } from 'antd'

export default {
  methods: {
    confirm (e) {
      console.log(e)
      message.success('Click on Yes')
    },
    cancel (e) {
      console.log(e)
      message.error('Click on No')
    },
  },
}
</script>
```
