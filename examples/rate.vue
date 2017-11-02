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
      :onChange="onChange"
      :onHoverChange="onHoverChange"></Rate>
    <span v-if="hoverValue">{{hoverValue}}stars</span>
    <span v-if="rValue">{{rValue}}stars</span>
    <br/>
    <Rate
      :allowHalf="allowHalf"
      :onHoverChange="onHoverChangeAH"></Rate>
    <span v-if="hoverValueAH">{{hoverValueAH}}stars</span>
    </br>
    自定义
    <Rate :value="initValue" :character="character"></Rate>
  </div>
</template>
<script>
import { Rate, Icon, Button } from '../components/index'
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
      this.initValue = undefined
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
