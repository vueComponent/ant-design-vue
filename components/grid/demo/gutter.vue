<template>
  <div class="grid" style="overflow: hidden;">
    <ant-row :gutter="24">
      <ant-col :span="6"><div class="color2">col-6</div></ant-col>
      <ant-col :span="6"><div class="color2">col-6</div></ant-col>
      <ant-col :span="6"><div class="color2">col-6</div></ant-col>
      <ant-col :span="6"><div class="color2">col-6</div></ant-col>
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
