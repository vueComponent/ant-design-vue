<template>
  <div id="right-bottom">
    <img
      v-if="isCN && isEffective('2021-10-17 10:00:00', '2021-10-23 18:00:00')"
      width="150"
      alt="早早聊 Vue 专场大会"
      :src="`https://next-antdv.oss-cn-beijing.aliyuncs.com/zaozaoliao.png?v=${Date.now()}`"
    />
    <img v-else-if="isCN" width="150" alt="官方公众号" src="https://qn.antdv.com/wechat.jpeg" />
    <div v-if="isMobile" class="close" @click="visible = false">
      <close-outlined />
    </div>
    <!-- <span v-if="isCN">广告</span> -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { CloseOutlined } from '@ant-design/icons-vue';
const isEffective = (start, end) => {
  return dayjs().isBetween(start, end);
};
export default {
  components: {
    CloseOutlined,
  },
  props: ['isCN', 'isMobile'],
  data() {
    return {
      isEffective,
      visible: true,
      ads: [
        {
          alt: 'geektime',
          img: 'https://qn.antdv.com/geektime-web-small.jpg',
          href: 'http://gk.link/a/10l8O',
          visible: isEffective('2020-09-03 10:00:00', '2020-10-04 10:00:00'),
        },
        {
          alt: 'powerproject',
          img: 'https://qn.antdv.com/powerproject.jpeg?v=20200327',
          href: 'http://www.powerproject.com.cn',
          visible: isEffective('2020-03-27 17:00:00', '2020-09-28 17:00:00'),
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
#right-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 150px;
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
