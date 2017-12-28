<template>
  <div>
    基本：
    <div>
      <Badge count=5>
        <a href="#" class="head-example" />
      </Badge>
      <Badge count=0 showZero>
        <a href="#" class="head-example" />
      </Badge>
    </div>
    <br>
    独立使用：
    <div>
      <Badge count=25 />
      <Badge count=4 :styles="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}" />
      <Badge count=109 :styles= "{backgroundColor: '#52c41a'} " />
    </div>
    <br>
    封顶数字：
    <div style="margin-top: 10px">
      <Badge count=99>
        <a href="#" class="head-example" />
      </Badge>
      <Badge count=100>
        <a href="#" class="head-example" />
      </Badge>
      <Badge count=99 overflowCount=10>
        <a href="#" class="head-example" />
      </Badge>
      <Badge count=1000 overflowCount=999>
        <a href="#" class="head-example" />
      </Badge>
    </div>
    <br>
     讨嫌的小红点：
    <div style="margin-top: 10px">
      <Badge dot>
        <Icon type="notification" />
      </Badge>
      <Badge dot>
        <a href="#">Link something</a>
      </Badge>
    </div>
    <br>
    状态点：
    <div>
      <Badge status="success" />
      <Badge status="error" />
      <Badge status="default" />
      <Badge status="processing" />
      <Badge :status="currentStatus" />
      <ant-button @click="changeStatus">改processing</ant-button>
      <br />
      <Badge status="success" text="Success" />
      <br />
      <Badge status="error" text="Error" />
      <br />
      <Badge status="default" text="Default" />
      <br />
      <Badge status="processing" text="Processing" />
      <br />
      <Badge status="warning" text="Warning" />
    </div>
    <br />
    动态：
    <div>
      <Badge :count="count">
        <a href="#" class="head-example" />
      </Badge>
      <ant-button @click="changeMinsValue()">
        <Icon type="minus" />
      </ant-button>
      <ant-button @click="changePlusValue(1)">
        <Icon type="plus" />
      </ant-button>
      <br/>
      <Badge :dot="isShow">
        <a href="#" class="head-example" />
      </Badge>
      <ant-button @click="changeShow()">toggle</ant-button>
    </div>
    <br />
  </div>
</template>
<script>
import '../style'
let i = 0
import { Badge, Button, Icon } from 'antd/index'
export default {
  data () {
    return {
      currentStatus: 'warning',
      count: 3,
      isShow: true,
    }
  },
  methods: {
    changeStatus () {
      this.currentStatus = 'processing'
    },
    changeMinsValue () {
      i++
      console.dir(i)
      let count = this.count - 1
      if (count < 0) {
        count = 0
      }
      this.count = count
    },
    changePlusValue () {
      setInterval(() => {
        const count = this.count + 1
        this.count = count
      }, 300)
      // const count = this.count + 1
      // this.count = count
    },
    changeShow () {
      this.isShow = !this.isShow
    },
  },
  components: {
    Badge,
    AntButton: Button,
    Icon,
  },
}
</script>
<style scoped>
  .head-example {
    width: 42px;
    height: 42px;
    border-radius: 6px;
    background: #eee;
    display: inline-block;
  }
  .ant-badge{
    margin-right: 20px;
  }
</style>
