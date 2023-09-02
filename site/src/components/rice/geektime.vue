<template>
  <div v-show="visible" id="geektime">
    <a
      href="https://time.geekbang.org/course/intro/100024601?code=KHKYcoBU6vZa8nMglg7AWfDxxi3BWrz9INAzAY3umPk%3D"
      target="_blank"
    >
      <img width="150" alt="Vue 实战教程" src="https://aliyuncdn.antdv.com/geektime-vue.jpeg" />
    </a>
    <div class="close" @click="visible = false">
      <close-outlined />
    </div>
  </div>
</template>

<script>
import { CloseOutlined } from '@ant-design/icons-vue';
export default {
  components: {
    CloseOutlined,
  },
  props: ['isMobile'],
  data() {
    return {
      visible: true,
    };
  },
};
</script>

<style lang="less" scoped>
#geektime {
  position: fixed;
  bottom: 10px;
  right: 10px;
  .close {
    position: absolute;
    text-align: center;
    top: -8px;
    right: -8px;
    font-size: 16px;
    padding: 15px;
    color: #6e3041;
  }
}
</style>
