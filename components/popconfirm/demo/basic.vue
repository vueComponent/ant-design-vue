<template>
<div>
<md>
## 基本
最简单的用法。
</md>
  <Popconfirm title="Are you sure delete this task?" @confirm="confirm" @cancel="cancel" okText="Yes" cancelText="No">
    <a href="#">Delete</a>
  </Popconfirm>
</div>
</template>

<script>
import { Popconfirm, Button } from 'antd'
export default {
  methods: {
    confirm (e) {
      console.log(e)
    },
    cancel (e) {
      console.log(e)
    },
  },
  components: {
    Popconfirm,
    AntButton: Button,
  },
}
</script>
