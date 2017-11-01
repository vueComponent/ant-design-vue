<template>
  <div>
    基本
    <Rate className="custom"></Rate>
    </br>
    半星
    <Rate :allowHalf="allowHalf"></Rate>
    </br>
    默认3颗星
    <Rate :value="initValue"></Rate>
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
    <Rate :value="initValue">
      <template slot-scope="props">
        <span>A</span>
      </template>
    </Rate>
  </div>
</template>
<script>
import { Rate } from '../components/index'
export default {
  data () {
    return {
      allowHalf: true,
      initValue: 3,
      disabled: true,
      hoverValue: undefined,
      rValue: undefined,
      hoverValueAH: undefined,
    }
  },
  methods: {
    onHoverChange(val) {
      this.hoverValue = val;
    },
    onChange(val) {
      this.rValue = val;
    },
    onHoverChangeAH(val) {
      this.hoverValueAH = val;
    }
  },
  components: {
    Rate
  },
}
</script>
