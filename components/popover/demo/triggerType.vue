<template>
<div>
<md>
## 三种触发方式
鼠标移入、聚集、点击。
</md>
  <Popover title="Title" trigger="hover">
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <AntButton type="primary">Hover me</AntButton>
  </Popover>
  <Popover title="Title" trigger="focus">
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <AntButton type="primary">Focus me</AntButton>
  </Popover>
  <Popover title="Title" trigger="click">
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <AntButton type="primary">Click me</AntButton>
  </Popover>
</div>
</template>

<script>
import { Popover, Button } from 'antd'
export default {
  components: {
    Popover,
    AntButton: Button,
  },
}
</script>
