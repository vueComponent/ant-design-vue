<template>
  <div>
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
    <div>
      <Badge :count="count">
        <a href="#" class="head-example" />
      </Badge>
      <ant-button @click="changeValue(1)">增加</ant-button>
      <ant-button @click="changeValue(-1)">减少</ant-button>
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
import { Badge, Button } from 'antd/index'
export default {
  data () {
    return {
      currentStatus: 'warning',
      count: 98,
      isShow: true,
    }
  },
  methods: {
    changeStatus () {
      this.currentStatus = 'processing'
    },
    changeValue (val) {
      this.count = this.count + val
    },
    changeShow () {
      this.isShow = !this.isShow
    },
  },
  components: {
    Badge,
    AntButton: Button,
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
</style>
