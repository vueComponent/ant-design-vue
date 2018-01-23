<template>
<div>
  <md>
  ## 自动调整位置
  气泡框不可见时自动调整位置。
  </md>
  <div :style="wrapStyles">
    <Tooltip placement="left" title="Prompt Text" :getPopupContainer="getPopupContainer">
      <a-button>Adjust automatically / 自动调整</a-button>
    </Tooltip>
    <br />
    <Tooltip placement="left" title="Prompt Text" :getPopupContainer="getPopupContainer" :autoAdjustOverflow="false">
      <a-button>Ingore / 不处理</a-button>
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

  },
}
</script>
