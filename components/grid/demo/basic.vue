<template>
  <div class="basic">
    <ant-row>
      <ant-col class="color1" :span="24" >100%</ant-col>
    </ant-row>
    <ant-row>
      <ant-col class="color1" :span="6" >25%</ant-col>
      <ant-col class="color1" :span="6" :offset="6" >25%</ant-col>
    </ant-row>
    <ant-row>
      <ant-col class="color1" :span="8" >33.33%</ant-col>
      <ant-col class="color1" :span="8" :offset="8" >33.33%</ant-col>
    </ant-row>
    <ant-row>
      <ant-col class="color1" :span="12" >50%</ant-col>
    </ant-row>
    <ant-row>
      <ant-col class="color1" :span="18" >66.66%</ant-col>
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
<style lang="less" scoped>
  .basic {
    background: linear-gradient(90deg,#f5f5f5 4.16666667%,transparent 0,transparent 8.33333333%,#f5f5f5 0,#f5f5f5 12.5%,transparent 0,transparent 16.66666667%,#f5f5f5 0,#f5f5f5 20.83333333%,transparent 0,transparent 25%,#f5f5f5 0,#f5f5f5 29.16666667%,transparent 0,transparent 33.33333333%,#f5f5f5 0,#f5f5f5 37.5%,transparent 0,transparent 41.66666667%,#f5f5f5 0,#f5f5f5 45.83333333%,transparent 0,transparent 50%,#f5f5f5 0,#f5f5f5 54.16666667%,transparent 0,transparent 58.33333333%,#f5f5f5 0,#f5f5f5 62.5%,transparent 0,transparent 66.66666667%,#f5f5f5 0,#f5f5f5 70.83333333%,transparent 0,transparent 75%,#f5f5f5 0,#f5f5f5 79.16666667%,transparent 0,transparent 83.33333333%,#f5f5f5 0,#f5f5f5 87.5%,transparent 0,transparent 91.66666667%,#f5f5f5 0,#f5f5f5 95.83333333%,transparent 0);
  }
  .basic div {
    text-align: center;
    vertical-align: middle;
    line-height: 40px;
  }
  .show-block {
    margin: 20px 0;
  }
  .color1 {
    background: rgba(0, 191, 255, 0.52);
    color: white;
  }
</style>
