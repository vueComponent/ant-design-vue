<template>
  <a href="https://www.surely.cool/" target="_blank">
    <div :class="cls">
      <div class="logo">
        <img height="80" src="https://www.surely.cool/surely-vue-logo.png" alt="" />
      </div>
      <div class="desc">
        <div class="title">Surely Vue</div>
        <div class="sub-title">
          构建更快的网站
          <br />
          更快的构建网站
        </div>
      </div>
    </div>
  </a>
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
.wrap {
  display: flex;
  background-color: #f4f8fa;
  padding: 10px 30px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100px;
  overflow: hidden;
}
.placeholder {
  height: 100px;
}
.desc {
  margin-left: 20px;
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
