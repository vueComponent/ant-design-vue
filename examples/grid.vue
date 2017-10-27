<template>
  <div class="grid">
    <div class="show-block">
      <ant-row gutter="10">
        <ant-col :style="style1" :span="6">
          <div :style="style2">1</div>
        </ant-col>
        <ant-col :style="style1" :span="6">
          <div :style="style2">2</div>
        </ant-col>
        <ant-col :style="style1" :span="6">
          <div :style="style2">3</div>
        </ant-col>
        <ant-col :style="style1" :span="6">
          <div :style="style2">4</div>
        </ant-col>
      </ant-row>
    </div>
    <div class="show-block">
      <ant-row gutter="10">
        <ant-col :style="style1" :span="6" :offset="2">
          <div :style="style2">offset = 2</div>
        </ant-col>
        <ant-col :style="style1" :span="6" :offset="2">
          <div :style="style2">offset = 2</div>
        </ant-col>
      </ant-row>
    </div>
    <div class="show-block">
      <ant-row gutter="10" type="flex">
        <ant-col class="height1 color1" :span="6">
          <div class="">F</div>
        </ant-col>
        <ant-col class="height2 color2" :span="6">
          <div class="">L</div>
        </ant-col>
        <ant-col class="height3 color1" :span="6">
          <div class="">E</div>
        </ant-col>
        <ant-col class="height4 color2" :span="6">
          <div class="">X</div>
        </ant-col>
      </ant-row>
    </div>
  </div>
</template>
<script>
import { Grid } from '../components'
const { Row, Col } = Grid
export default {
  data () {
    return {
      style1: { height: 40 + 'px' },
      style2: { background: '#00bfff', height: 40 + 'px' }
    }
  },
  methods: {
    handleClick (event) {
      console.log(event)
      this.type = this.type === 'primary' ? 'danger' : 'primary'
    },
  },
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
  .show-block {
    margin: 20px 0;
  }
  .height1 {
    height: 60px;
  }
  .height2 {
    height: 40px;
  }
  .height3 {
    height: 80px;
  }
  .height4 {
    height: 50px;
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
