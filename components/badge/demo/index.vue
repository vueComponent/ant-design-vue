<template>
  <div>
    基本：
    <div>
      <a-badge count=5>
        <a href="#" class="head-example" />
      </a-badge>
      <a-badge count=0 showZero>
        <a href="#" class="head-example" />
      </a-badge>
    </div>
    <br>
    独立使用：
    <div>
      <a-badge count=25 />
      <a-badge count=4 :styles="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}" />
      <a-badge count=109 :styles= "{backgroundColor: '#52c41a'} " />
    </div>
    <br>
    封顶数字：
    <div style="margin-top: 10px">
      <a-badge count=99>
        <a href="#" class="head-example" />
      </a-badge>
      <a-badge count=100>
        <a href="#" class="head-example" />
      </a-badge>
      <a-badge count=99 overflowCount=10>
        <a href="#" class="head-example" />
      </a-badge>
      <a-badge count=1000 overflowCount=999>
        <a href="#" class="head-example" />
      </a-badge>
    </div>
    <br>
     讨嫌的小红点：
    <div style="margin-top: 10px">
      <a-badge dot>
        <a-icon type="notification" />
      </a-badge>
      <a-badge dot>
        <a href="#">Link something</a>
      </a-badge>
    </div>
    <br>
    状态点：
    <div>
      <a-badge status="success" />
      <a-badge status="error" />
      <a-badge status="default" />
      <a-badge status="processing" />
      <a-badge :status="currentStatus" />
      <a-button @click="changeStatus">改processing</a-button>
      <br />
      <a-badge status="success" text="Success" />
      <br />
      <a-badge status="error" text="Error" />
      <br />
      <a-badge status="default" text="Default" />
      <br />
      <a-badge status="processing" text="Processing" />
      <br />
      <a-badge status="warning" text="Warning" />
    </div>
    <br />
    动态：
    <div>
      <a-badge :count="count">
        <a href="#" class="head-example" />
      </a-badge>
      <a-button @click="changeMinsValue()">
        <a-icon type="minus" />
      </a-button>
      <a-button @click="changePlusValue(1)">
        <a-icon type="plus" />
      </a-button>
      <br/>
      <a-badge :dot="isShow">
        <a href="#" class="head-example" />
      </a-badge>
      <a-button @click="changeShow()">toggle</a-button>
    </div>
    <br />
  </div>
</template>
<script>
let i = 0
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
      // setInterval(() => {
      //   const count = this.count + 1
      //   this.count = count
      // }, 300)
      const count = this.count + 1
      this.count = count
    },
    changeShow () {
      this.isShow = !this.isShow
    },
  },
}
</script>
<style scoped>
  .head-example {
    width: 42px;
    height: 42px;
    border-radius: 4px;
    background: #eee;
    display: inline-block;
  }
  .ant-badge{
    margin-right: 20px;
  }
</style>
