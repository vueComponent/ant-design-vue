<template>
<div id="components-popover-demo-placement">
<md>
## 位置
位置有 12 个方向。
</md>
  <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
    <Popover placement="topLeft">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>TL</AntButton>
    </Popover>
    <Popover placement="top">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>Top</AntButton>
    </Popover>
    <Popover placement="topRight">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>TR</AntButton>
    </Popover>
  </div>
  <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
    <Popover placement="leftTop">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>LT</AntButton>
    </Popover>
    <Popover placement="left">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>Left</AntButton>
    </Popover>
    <Popover placement="leftBottom">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>LB</AntButton>
    </Popover>
  </div>
  <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
    <Popover placement="rightTop">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>RT</AntButton>
    </Popover>
    <Popover placement="right">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>Right</AntButton>
    </Popover>
    <Popover placement="rightBottom">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>RB</AntButton>
    </Popover>
  </div>
  <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
    <Popover placement="bottomLeft">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>BL</AntButton>
    </Popover>
    <Popover placement="bottom">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>Bottom</AntButton>
    </Popover>
    <Popover placement="bottomRight">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <template slot="title">
        <span>Title</span>
      </template>
      <AntButton>BR</AntButton>
    </Popover>
  </div>
</div>
</template>

<script>
import { Popover, Button } from 'antd'
export default {
  data () {
    return {
      buttonWidth: 70,
    }
  },
  components: {
    Popover,
    AntButton: Button,
  },
}
</script>
<style>
#components-popover-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
