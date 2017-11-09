<template>
  <div class="grid">
    <p>sub-element align left</p>
    <ant-row type="flex" justify="start">
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
    </ant-row>

    <p>sub-element align center</p>
    <ant-row type="flex" justify="center">
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
    </ant-row>

    <p>sub-element align right</p>
    <ant-row type="flex" justify="end">
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
    </ant-row>

    <p>sub-element monospaced arrangement</p>
    <ant-row type="flex" justify="space-between">
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
    </ant-row>

    <p>sub-element align full</p>
    <ant-row type="flex" justify="space-around">
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
      <ant-col :span="4" class="color1">col-4</ant-col>
      <ant-col :span="4" class="color2">col-4</ant-col>
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
