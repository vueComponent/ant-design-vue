<template>
  <div class="grid">
    <ant-row>
      <ant-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10" class="color1">Col</ant-col>
      <ant-col :xs="20" :sm="16" :md="12" :lg="8" :xl="4" class="color2">Col</ant-col>
      <ant-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10" class="color1">Col</ant-col>
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
