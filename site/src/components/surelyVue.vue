<template>
  <div class="container">
    <a-carousel autoplay>
      <a style="display: inline-block" href="https://form.antdv.com/" target="_blank">
        <div :class="cls">
          <div class="logo">
            <img height="80" src="https://aliyuncdn.antdv.com/form/static/logo-blue.png" alt="" />
          </div>
          <div class="desc">
            <!-- <div class="title">Surely Form</div> -->
            <div class="sub-title">
              <strong>雪梨表单、为您定制</strong>
              <br />
              专属的调研，投票、NPS、报名等系统
            </div>
          </div>
        </div>
      </a>
      <a style="display: inline-block" href="https://www.surely.cool/" target="_blank">
        <div :class="cls">
          <div class="logo">
            <img height="80" src="https://www.surely.cool/surely-vue-logo.png" alt="" />
          </div>
          <div class="desc">
            <div class="title">Surely Table</div>
            <div class="sub-title">
              构建更快的网站
              <br />
              更快的构建网站
            </div>
          </div>
        </div>
      </a>
    </a-carousel>
  </div>
  <div class="placeholder"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
export default defineComponent({
  props: {
    type: { type: String as PropType<'x' | 'y'> },
  },
  setup(props) {
    return {
      cls: {
        wrap: true,
        [`wrap-${props.type}`]: true,
      },
    };
  },
});
</script>
<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100px;
}
.wrap {
  display: flex;
  background-color: #f4f8fa;
  padding: 8px 16px;
  width: 100%;
  height: 100px;
  overflow: hidden;
  box-sizing: border-box;
}
.logo {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder {
  height: 116px;
}
.desc {
  margin-left: 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.85);
  font-family: Avenir, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji', sans-serif;
}
.title {
  font-size: 18px;
}
.sub-title {
  opacity: 0.7;
  margin-top: 5px;
}
</style>
