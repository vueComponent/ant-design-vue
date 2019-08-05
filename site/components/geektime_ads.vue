<template>
  <div
    v-if="isEffective(effectiveTime)"
    id="geektime-ads"
    :class="isMobile ? 'geektime-ads-mobile':''"
  >
    <a
      href="https://time.geekbang.org/column/intro/216?utm_term=zeusH8E0I&utm_source=website&utm_medium=tangjinzhou"
      target="_blank"
    >
      <img
        height="100"
        alt="浏览器工作原理与实践"
        src="https://cdn.nlark.com/yuque/0/2019/jpeg/87084/1564994550991-assets/web-upload/fd11d2ba-7351-47d5-bf87-aa9eb2a10256.jpeg"
      />
    </a>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: ['isMobile'],
  data() {
    return {
      visible: true,
      effectiveTime: {
        start: '2019-08-05 17:00:00',
        end: '2019-09-05 17:00:00',
      },
    };
  },
  methods: {
    isEffective({ start, end }) {
      return moment().isBetween(start, end);
    },
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
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
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

