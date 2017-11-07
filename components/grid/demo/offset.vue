<template>
  <div class="grid">
    <ant-row>
      <ant-col :span="8" class="color1">col-8</ant-col>
      <ant-col :span="8" :offset="8" class="color2">col-8</ant-col>
    </ant-row>
    <ant-row>
      <ant-col :span="6" :offset="6" class="color1">col-6 col-offset-6</ant-col>
      <ant-col :span="6" :offset="6" class="color2">col-6 col-offset-6</ant-col>
    </ant-row>
    <ant-row>
      <ant-col :span="12" :offset="6" class="color1">col-12 col-offset-6</ant-col>
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
