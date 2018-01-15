<template>
<div>
  <md>
  ## 自动调整位置
  气泡框不可见时自动调整位置。
  </md>
  <div :style="wrapStyles">
    <Tooltip placement="left" title="Prompt Text" :getPopupContainer="getPopupContainer">
      <AntButton>Adjust automatically / 自动调整</AntButton>
    </Tooltip>
    <br />
    <Tooltip placement="left" title="Prompt Text" :getPopupContainer="getPopupContainer" :autoAdjustOverflow="false">
      <AntButton>Ingore / 不处理</AntButton>
    </Tooltip>
  </div>
</div>
</template>

<script>
import { Tooltip, Button } from 'antd'
const wrapStyles = {
  overflow: 'hidden',
  position: 'relative',
  padding: '24px',
  border: '1px solid #e9e9e9',
}
export default {
  data () {
    return {
      wrapStyles,
    }
  },
  methods: {
    getPopupContainer (trigger) {
      return trigger.parentElement
    },
  },
  components: {
    Tooltip,
    AntButton: Button,
  },
}
</script>
