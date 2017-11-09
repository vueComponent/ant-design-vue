<template>
  <div class="grid">
    <ant-row>
      <ant-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }" class="color1">Col</ant-col>
      <ant-col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }" class="color2">Col</ant-col>
      <ant-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }" class="color1">Col</ant-col>
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
