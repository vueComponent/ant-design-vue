<template>
<div id="components-popconfirm-demo-placement">
<md>
## 位置
位置有十二个方向。如需箭头指向目标元素中心，可以设置 `arrowPointAtCenter`。
</md>
  <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
    <Popconfirm placement="topLeft" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>TL</AntButton>
    </Popconfirm>
    <Popconfirm placement="top" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>Top</AntButton>
    </Popconfirm>
    <Popconfirm placement="topRight" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>TR</AntButton>
    </Popconfirm>
  </div>
  <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
    <Popconfirm placement="leftTop" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>LT</AntButton>
    </Popconfirm>
    <Popconfirm placement="left" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>Left</AntButton>
    </Popconfirm>
    <Popconfirm placement="leftBottom" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>LB</AntButton>
    </Popconfirm>
  </div>
  <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
    <Popconfirm placement="rightTop" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>RT</AntButton>
    </Popconfirm>
    <Popconfirm placement="right" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>Right</AntButton>
    </Popconfirm>
    <Popconfirm placement="rightBottom" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>RB</AntButton>
    </Popconfirm>
  </div>
  <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
    <Popconfirm placement="bottomLeft" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>BL</AntButton>
    </Popconfirm>
    <Popconfirm placement="bottom" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>Bottom</AntButton>
    </Popconfirm>
    <Popconfirm placement="bottomRight" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <div>
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
        </div>
      </template>
      <AntButton>BR</AntButton>
    </Popconfirm>
  </div>
</div>
</template>

<script>
import { Popconfirm, Button } from 'antd'
export default {
  data () {
    return {
      buttonWidth: 70,
    }
  },
  methods: {
    confirm () {
      console.log('Click on Yes')
    },
  },
  components: {
    Popconfirm,
    AntButton: Button,
  },
}
</script>
<style>
#components-popconfirm-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
