<template>
<div>
<md>
## 条件触发
可以判断是否需要弹出。
</md>
  <Popconfirm
    title="Are you sure delete this task?"
    :visible="visible"
    @visibleChange="handleVisibleChange"
    @confirm="confirm"
    @cancel="cancel"
    okText="Yes"
    cancelText="No"
  >
    <a href="#">Delete a task</a>
  </Popconfirm>
  <br />
  <br />
  Whether directly execute：<Checkbox defaultChecked @change="changeCondition" />
</div>
</template>

<script>
import { Popconfirm, Checkbox } from 'antd'
export default {
  data () {
    return {
      visible: false,
      condition: true,
    }
  },
  methods: {
    changeCondition (e) {
      this.condition = e.target.checked
    },
    confirm () {
      this.visible = false
    },
    cancel () {
      this.visible = false
    },
    handleVisibleChange (visible) {
      if (!visible) {
        this.visible = false
        return
      }
      // Determining condition before show the popconfirm.
      console.log(this.condition)
      if (this.condition) {
        this.confirm() // next step
      } else {
        this.visible = true
      }
    },
  },
  components: {
    Popconfirm,
    Checkbox,
  },
}
</script>
