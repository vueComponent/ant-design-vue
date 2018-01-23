<template>
<div>
<md>
## 箭头指向
设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。
</md>
  <Popover placement="topLeft">
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <span slot="title">Title</span>
    <a-button>Align edge / 边缘对齐</a-button>
  </Popover>
  <Popover placement="topLeft" arrowPointAtCenter>
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <span slot="title">Title</span>
    <a-button>Arrow points to center / 箭头指向中心</a-button>
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
