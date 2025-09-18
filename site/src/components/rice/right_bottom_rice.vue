<template>
  <div v-if="isCN" id="right-bottom">
    <img v-if="isCN" width="150" :src="`https://next.antdv.com/common_rice.png?v=${v}`" />
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
      v: dayjs().date(),
      ads: [],
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
