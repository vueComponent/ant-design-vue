<template>
  <div class="snd-ad" style="padding-left: 40px">
    <div class="sponsorsWrap">
      <span v-if="!isCN" class="sponsorsTitle">
        {{ isCN ? '赞助商' : 'Sponsors' }}
      </span>
      <ul>
        <!-- <li class="sponsorsItem">
          <a href="https://tipe.io/?ref=ant-design-vue" target="_blank">
            <img height="51" src="https://cdn.tipe.io/tipe/tipe-cat-no-text.svg" alt="tipe" />
          </a>
        </li> -->
        <li v-if="isCN && isEffective(effectiveTime.kkb)" class="sponsorsItem">
          <a href="https://datayi.cn/w/Y9J3M2vR" target="_blank">
            <img height="66" src="https://qn.antdv.com/kaikeba_ssr.jpeg" alt="kaikeba" />
          </a>
        </li>
        <li class="sponsorsItem" style="padding: 10px 0">
          <a-button type="primary" ghost style="font-size: 12px" @click="handleClick">
            {{ isCN ? '成为赞助商' : 'Become a Sponsor' }}
          </a-button>
        </li>
      </ul>
    </div>
    <a-modal v-model:visible="visible" title="成为赞助商" @ok="visible = false">
      如果您有品牌推广、活动推广、招聘推广、社区合作等需求，欢迎联系我们，成为赞助商。
      <br />
      您的广告将出现在 And Design Vue 文档所有子页面及 GitHub Readme 等页面。
      <br />
      咨询邮箱：
      <a href="mailto:antdv@foxmail.com">antdv@foxmail.com</a>
      <br />
    </a-modal>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
export default {
  props: ['isCN'],
  data() {
    return {
      top: 50,
      effectiveTime: {
        bmatch: {
          start: '2019-03-11',
          end: '2019-06-11',
        },
        kkb: {
          start: '2020-11-16 22:00:00',
          end: '2021-05-17 22:00:00',
        },
      },
      visible: false,
    };
  },
  methods: {
    isEffective({ start, end }) {
      return dayjs().isBetween(start, end);
    },
    handleClick() {
      if (this.isCN) {
        this.visible = true;
      } else {
        window.open('https://opencollective.com/ant-design-vue#sponsor');
      }
    },
  },
};
</script>
