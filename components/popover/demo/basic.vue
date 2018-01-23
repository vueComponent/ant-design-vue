<template>
<div>
<md>
## 基本
最简单的用法，浮层的大小由内容区域决定。
</md>
<Popover title="Title">
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <a-button type="primary">Hover me</a-button>
  </Popover>
</div>
</template>

<script>
import { Popover, Button } from 'antd'
export default {
  components: {
    Popover,

  },
}
</script>
