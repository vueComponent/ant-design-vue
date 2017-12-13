<template>
  <div>
    基本
    <Rate class="custom"></Rate>
    </br>
    半星
    <Rate :allowHalf="allowHalf"></Rate>
    </br>
    默认3颗星
    <Rate v-model="initValue"></Rate>
    <AntButton type="primary" @click="changeValue">改变</AntButton>
    <AntButton type="primary" @click="getValue">当前值</AntButton>
    </br>
    只读
    <Rate :value="initValue" :disabled="disabled"></Rate>
    </br>
    回调函数
    <Rate
      @change="onChange"
      @hover-change="onHoverChange"></Rate>
    <span v-if="hoverValue">{{hoverValue}}stars</span>
    <span v-if="rValue">{{rValue}}stars</span>
    <br/>
    <Rate
      :allowHalf="allowHalf"
      @hover-change="onHoverChangeAH"></Rate>
    <span v-if="hoverValueAH">{{hoverValueAH}}stars</span>
    </br>
    自定义
    </br>
    <Rate v-model="initValue" :allowHalf="allowHalf">
      <Icon type="heart" />
    </Rate>
    </br>
    <Rate :value="initValue" :allowHalf="allowHalf" character="A"></Rate>
    </br>
    <Rate :value="initValue"  character="好"></Rate>
  </div>
</template>
<script>
import '../style'
import { Rate, Icon, Button } from 'antd/index'
export default {
  data () {
    return {
      allowHalf: true,
      initValue: 3,
      disabled: true,
      hoverValue: undefined,
      rValue: undefined,
      hoverValueAH: undefined,
      character: '好',
    }
  },
  methods: {
    onHoverChange (val) {
      this.hoverValue = val
    },
    onChange (val) {
      this.rValue = val
    },
    onHoverChangeAH (val) {
      this.hoverValueAH = val
    },
    changeValue () {
      this.initValue = 4
    },
    getValue () {
      console.log(this.initValue)
    },
  },
  components: {
    Rate,
    Icon,
    AntButton: Button,
  },
}
</script>
