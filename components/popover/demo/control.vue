<template>
<div>
  <md>
  ## 从浮层内关闭
  使用 `visible` 属性控制浮层显示。
  </md>
  <Popover
    title="Title"
    trigger="click"
    v-model="visible"
  >
    <template slot="content">
      <a @click="hide">Close</a>
    </template>
    <AntButton type="primary">Click me</AntButton>
  </Popover>
</div>
</template>

<script>
import { Popover, Button } from 'antd'
export default {
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    hide () {
      console.log(111)
      this.visible = false
    },
  },
  components: {
    Popover,
    AntButton: Button,
  },
}
</script>
