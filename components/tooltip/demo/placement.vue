<template>
<div id="components-tooltip-demo-placement">
<md>
## 位置
位置有 12 个方向。
</md>
  <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
    <Tooltip placement="topLeft">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>TL</AntButton>
    </Tooltip>
    <Tooltip placement="top">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>Top</AntButton>
    </Tooltip>
    <Tooltip placement="topRight">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>TR</AntButton>
    </Tooltip>
  </div>
  <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
    <Tooltip placement="leftTop">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>LT</AntButton>
    </Tooltip>
    <Tooltip placement="left">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>Left</AntButton>
    </Tooltip>
    <Tooltip placement="leftBottom">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>LB</AntButton>
    </Tooltip>
  </div>
  <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
    <Tooltip placement="rightTop">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>RT</AntButton>
    </Tooltip>
    <Tooltip placement="right">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>Right</AntButton>
    </Tooltip>
    <Tooltip placement="rightBottom">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>RB</AntButton>
    </Tooltip>
  </div>
  <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
    <Tooltip placement="bottomLeft">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>BL</AntButton>
    </Tooltip>
    <Tooltip placement="bottom">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>Bottom</AntButton>
    </Tooltip>
    <Tooltip placement="bottomRight">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <AntButton>BR</AntButton>
    </Tooltip>
  </div>
</div>
</template>

<script>
import { Tooltip, Button } from 'antd'
export default {
  data () {
    return {
      buttonWidth: 70,
    }
  },
  components: {
    Tooltip,
    AntButton: Button,
  },
}
</script>
<style>
#components-tooltip-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
