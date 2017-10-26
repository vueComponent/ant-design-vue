<template>
  <div>
    <AntButton @click="handleClick">toogle dialog</AntButton>
    <AntDialog :visible="visible">
      测试{{visible}}
    </AntDialog>
  </div>
</template>
<script>
import Dialog from '../src/dialog/index'
import Button from '../src/index'
export default {
  data () {
    return {
      visible: true,
      show: false,
    }
  },
  methods: {
    handleClick (event) {
      this.visible = !this.visible
    },
  },
  components: {
    AntDialog: Dialog,
    AntButton: Button,
  },
}
</script>
