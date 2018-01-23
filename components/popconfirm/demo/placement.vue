<template>
<div id="components-popconfirm-demo-placement">
<md>
## 位置
位置有十二个方向。如需箭头指向目标元素中心，可以设置 `arrowPointAtCenter`。
</md>
  <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
    <Popconfirm placement="topLeft" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>TL</a-button>
    </Popconfirm>
    <Popconfirm placement="top" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>Top</a-button>
    </Popconfirm>
    <Popconfirm placement="topRight" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>TR</a-button>
    </Popconfirm>
  </div>
  <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
    <Popconfirm placement="leftTop" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>LT</a-button>
    </Popconfirm>
    <Popconfirm placement="left" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>Left</a-button>
    </Popconfirm>
    <Popconfirm placement="leftBottom" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>LB</a-button>
    </Popconfirm>
  </div>
  <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
    <Popconfirm placement="rightTop" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>RT</a-button>
    </Popconfirm>
    <Popconfirm placement="right" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>Right</a-button>
    </Popconfirm>
    <Popconfirm placement="rightBottom" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>RB</a-button>
    </Popconfirm>
  </div>
  <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
    <Popconfirm placement="bottomLeft" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>BL</a-button>
    </Popconfirm>
    <Popconfirm placement="bottom" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
          <p>Are you sure delete this task?</p>
          <p>Are you sure delete this task?</p>
      </template>
      <a-button>Bottom</a-button>
    </Popconfirm>
    <Popconfirm placement="bottomRight" okText="Yes" cancelText="No" @confirm="confirm">
      <template slot="title">
        <p>Are you sure delete this task?</p>
        <p>Are you sure delete this task?</p>
      </template>
      <a-button>BR</a-button>
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
