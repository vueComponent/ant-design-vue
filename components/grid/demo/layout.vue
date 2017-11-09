<template>
  <div class="grid">
    <ant-row>
      <ant-col class="color1" :span="12" >col-12</ant-col>
      <ant-col class="color2" :span="12" >col-12</ant-col>
    </ant-row>
    <ant-row>
      <ant-col class="color1" :span="8" >col-8</ant-col>
      <ant-col class="color2" :span="8" >col-8</ant-col>
      <ant-col class="color1" :span="8" >col-8</ant-col>
    </ant-row>
    <ant-row>
      <ant-col class="color1" :span="6" >col-6</ant-col>
      <ant-col class="color2" :span="6" >col-6</ant-col>
      <ant-col class="color1" :span="6" >col-6</ant-col>
      <ant-col class="color2" :span="6" >col-6</ant-col>
    </ant-row>
  </div>
</template>
<script>
  import { Grid } from 'antd'
  const { Row, Col } = Grid
  export default {
    components: {
      AntRow: Row,
      AntCol: Col
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
</style>
