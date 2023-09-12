<template>
  <div
    v-if="isEffective(effectiveTime)"
    id="geektime-ads"
    :class="isMobile ? 'geektime-ads-mobile' : ''"
  >
    <a
      href="https://time.geekbang.org/column/intro/154?utm_term=zeusGZFFE&utm_source=app&utm_medium=tangjinzhou"
      target="_blank"
    >
      <img height="100" alt="重学前端" src="https://aliyuncdn.antdv.com/chongxueqianduan.jpg" />
    </a>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { defineComponent } from 'vue';
dayjs.extend(isBetween);

export default defineComponent({
  props: {
    isMobile: Boolean,
  },
  setup() {
    return {
      visible: true,
      effectiveTime: {
        start: '2019-08-05 17:00:00',
        end: '2019-09-05 17:00:00',
      },
      isEffective({ start, end }) {
        return dayjs().isBetween(start, end);
      },
    };
  },
});
</script>

<style lang="less" scoped>
#geektime-ads {
  width: 266px;
  position: fixed;
  left: 0;
  bottom: 0px;
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
