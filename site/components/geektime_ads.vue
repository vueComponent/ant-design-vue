<template>
  <div
    v-show="visible"
    id="geektime-ads"
    :class="isMobile ? 'geektime-ads-mobile':''"
  >
    <a
      href="https://time.geekbang.org/course/intro/163?code=KHKYcoBU6vZa8nMglg7AWfDxxi3BWrz9INAzAY3umPk%3D"
      target="_blank"
    >
      <img
        height="100"
        alt="Vue 实战教程"
        src="https://cdn.nlark.com/yuque/0/2019/jpeg/87084/1562230861353-assets/web-upload/2fab2df7-5cc9-4791-b344-a97da29eb400.jpeg"
      >
    </a>
  </div>
</template>

<script>
export default {
  props: ['isMobile'],
  data() {
    return {
      visible: true,
    };
  },
};
</script>

<style lang="less" scoped>
  #geektime-ads {
    max-width: 280px;
    height: 100px;
    float: right;
    position: relative;
    right: 0;
    bottom: 0;
    padding: 0;
    overflow: hidden;
    z-index: 9;
    background-color: #fff;
    border-radius: 3px;
    font-size: 13px;
    background: #f5f5f5;
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  }
  #geektime-ads.geektime-ads-mobile {
    width: 100%;
    position: relative;
    right: 0;
    bottom: 0;
    padding: 0;
    margin-bottom: 15px;
  }
</style>

