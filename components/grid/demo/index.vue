<template>
  <div class="topLevel">
    <h1>基础布局</h1>
    <basic/>
    <h1>恩。基础</h1>
    <layout/>
    <h1>区块间隔</h1>
    <gutter/>
    <h1>偏移</h1>
    <offset/>
    <h1>栅格排序</h1>
    <pull/>
    <h1>FLEX</h1>
    <flex/>
    <h1>对齐</h1>
    <align/>
    <h1>Flex排序</h1>
    <flex-order/>
    <h1>响应式设计</h1>
    <flexible/>
    <h1>复杂一点</h1>
    <complex/>
  </div>
</template>
<script>
import { Grid } from 'antd'
const { Row, Col } = Grid
import Basic from './basic.vue'
import Layout from './layout.vue'
import Gutter from './gutter.vue'
import Offset from './offset.vue'
import Pull from './pull.vue'
import Flex from './flex.vue'
import Align from './align.vue'
import FlexOrder from './flex-order.vue'
import Flexible from './flexible.vue'
import Complex from './complex.vue'
export default {
  components: {
    AntRow: Row,
    AntCol: Col,
    Basic,
    Layout,
    Gutter,
    Offset,
    Pull,
    Flex,
    Align,
    FlexOrder,
    Flexible,
    Complex,
  },
}
</script>
<style lang="less">
  .topLevel .ant-row{
    margin: 10px 0;
  }
  .grid div {
    text-align: center;
    vertical-align: middle;
    line-height: 40px;
  }
  .show-block {
    margin: 20px 0;
  }
  .color1 {
    background: #00bfff;
    color: white;
  }
  .color2 {
    background: #0e77ca;
    color: white;
  }
</style>
