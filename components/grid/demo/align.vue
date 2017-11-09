<template>
  <div class="grid">
    <ant-row type="flex" justify="center" align="top">
      <ant-col :span="4" class="color1"><DemoBox :value="100">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color2"><DemoBox :value="50">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color1"><DemoBox :value="120">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color2"><DemoBox :value="80">col-4</DemoBox></ant-col>
    </ant-row>

    <p>Align Center</p>
    <ant-row type="flex" justify="space-around" align="middle">
      <ant-col :span="4" class="color1"><DemoBox :value="100">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color2"><DemoBox :value="50">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color1"><DemoBox :value="120">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color2"><DemoBox :value="80">col-4</DemoBox></ant-col>
    </ant-row>

    <p>Align Bottom</p>
    <ant-row type="flex" justify="space-between" align="bottom">
      <ant-col :span="4" class="color1"><DemoBox :value="100">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color2"><DemoBox :value="50">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color1"><DemoBox :value="120">col-4</DemoBox></ant-col>
      <ant-col :span="4" class="color2"><DemoBox :value="80">col-4</DemoBox></ant-col>
    </ant-row>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Grid } from 'antd'
  const { Row, Col } = Grid
  const DemoBox = Vue.component('DemoBox', {
    props: ['value'],
    template: `<p :style="{height: value + 'px'}">{{value}}</p>`,
  })
  export default {
    components: {
      AntRow: Row,
      AntCol: Col,
      DemoBox,
    },
  }


</script>
<style lang="less">
  .grid div {
    text-align: center;
    vertical-align: middle;
    line-height: 40px;
  }
  .color1 {
    background: rgb(0, 191, 255);
    color: white;
  }
  .color2 {
    background: #0e77ca;
    color: white;
  }
  .height-100 {
    height: 100px;
  }
</style>
