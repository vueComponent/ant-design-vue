<template>
<div>
<md>
## 国际化
使用 `okText` 和 `cancelText` 自定义按钮文字。
</md>
  <Popconfirm title="Are you sure？" okText="Yes" cancelText="No">
    <a href="#">Delete</a>
  </Popconfirm>
</div>
</template>

<script>
import { Popconfirm } from 'antd'
export default {
  components: {
    Popconfirm,
  },
}
</script>
