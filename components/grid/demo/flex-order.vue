<template>
  <div class="grid">
    <ant-row type="flex">
      <ant-col :span="6" :order="4" class="color1">1 col-order-4</ant-col>
      <ant-col :span="6" :order="3" class="color2">2 col-order-3</ant-col>
      <ant-col :span="6" :order="2" class="color1">3 col-order-2</ant-col>
      <ant-col :span="6" :order="1" class="color2">4 col-order-1</ant-col>
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
