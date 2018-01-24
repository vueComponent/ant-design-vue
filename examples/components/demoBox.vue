<template>
  <div class="box box-demo">
    <slot name="component"></slot>
    <div class="box-demo-description">
      <slot v-if="lang === 'cn'" name="description"></slot>
      <slot v-else name="us-description"></slot>
      <span class="btn-toggle" :class="{open: isOpen}" @click="toggle"><i class="anticon anticon-down-circle-o"></i></span>
    </div>
    <transition appear :css="false" @enter="enter" @leave="leave">
      <div class="box-demo-code" v-show="isOpen">
        <slot name="code"></slot>
      </div>
    </transition>
  </div>
</template>
<script>
import animate from 'antd/_util/openAnimation'
export default {
  name: 'demoBox',
  props: {
    jsfiddle: Object,
  },
  data () {
    console.log(this.jsfiddle.html)
    const { lang } = this.$route.params
    return {
      isOpen: false,
      lang,
    }
  },
  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    },
    enter: animate.enter,
    leave: animate.leave,
  },
}
</script>
<style scoped lang="less">
.box-demo{
  padding: 0;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  box-shadow: none;
  margin-top: 20px;
  margin-bottom: 20px;
}
.box-demo-show{
  padding: 20px 25px 30px;
  border-bottom: 1px solid #e9e9e9;
}
.box-demo-description{
  position: relative;
  padding: 17px 16px 15px 20px;
  border-radius: 0 0 6px 6px;
  -webkit-transition: background-color 0.4s ease;
  transition: background-color 0.4s ease;
  width: 100%;
  font-size: 12px;
  &.bordered{
    border-bottom: 1px dashed #e9e9e9;
  }
  h3, h4{
    position: absolute;
    top: -14px;
    padding: 1px 8px;
    margin-left: -8px;
    margin-top: 0;
    margin-bottom: 0;
    color: #777;
    border-radius: 4px;
    border-top-left-radius: 0;
    background: #fff;
    -webkit-transition: background-color 0.4s ease;
    transition: background-color 0.4s ease;
    .header-anchor{
      display: none;
    }
  }
  li{
    line-height: 21px;
  }
}
.box-demo-code{
  -webkit-transition: height .2s ease-in-out;
  transition: height .2s ease-in-out;
  overflow: auto;
  border-top: 1px dashed #e9e9e9;
  pre {
    margin: 0;
  }
  code{
    margin: 0;
    background: #f7f7f7;
    padding: .2em .4em;
    border-radius: 3px;
    font-size: .9em;
    border: 1px solid #eee;
  }
}
.btn-toggle{
  position: absolute;
  right: 16px;
  bottom: 17px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  font-size: 18px;
  line-height: 18px;
  color: #999;
  i{
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  &.open{
    i{
      -webkit-transform: rotate(-180deg);
      -ms-transform: rotate(-180deg);
      transform: rotate(-180deg);
    }
  }
}
</style>
