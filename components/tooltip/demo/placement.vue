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
      <a-button>TL</a-button>
    </Tooltip>
    <Tooltip placement="top">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>Top</a-button>
    </Tooltip>
    <Tooltip placement="topRight">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>TR</a-button>
    </Tooltip>
  </div>
  <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
    <Tooltip placement="leftTop">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>LT</a-button>
    </Tooltip>
    <Tooltip placement="left">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>Left</a-button>
    </Tooltip>
    <Tooltip placement="leftBottom">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>LB</a-button>
    </Tooltip>
  </div>
  <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
    <Tooltip placement="rightTop">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>RT</a-button>
    </Tooltip>
    <Tooltip placement="right">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>Right</a-button>
    </Tooltip>
    <Tooltip placement="rightBottom">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>RB</a-button>
    </Tooltip>
  </div>
  <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
    <Tooltip placement="bottomLeft">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>BL</a-button>
    </Tooltip>
    <Tooltip placement="bottom">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>Bottom</a-button>
    </Tooltip>
    <Tooltip placement="bottomRight">
      <template slot="title">
        <span>prompt text</span>
      </template>
      <a-button>BR</a-button>
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
