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
    <a @click="hide" slot="content">Close</a>
    <a-button type="primary">Click me</a-button>
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

  },
}
</script>
