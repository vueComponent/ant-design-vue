<template>
  <div class="snd-ad">
    <div class="sponsorsWrap">
      <span class="sponsorsTitle">
        {{ isCN ? '赞助商' : 'Sponsors' }}
      </span>
      <ul>
        <li class="sponsorsItem">
          <a href="https://tipe.io/?ref=ant-design-vue" target="_blank">
            <img height="51" src="https://cdn.tipe.io/tipe/tipe-cat-no-text.svg" alt="tipe" />
          </a>
        </li>
        <li v-if="isEffective(effectiveTime.bmatch)" class="sponsorsItem">
          <a href="https://www.youkeda.com?from=vue" target="_blank">
            <img height="66" width="34" src="https://qn.antdv.com/youkeda.jpeg" alt="bmatch" />
          </a>
        </li>
        <li class="sponsorsItem">
          <a-button type="primary" ghost style="font-size: 12px" @click="handleClick">
            {{ isCN ? '成为赞助商' : 'Become a Sponsor' }}
          </a-button>
        </li>
      </ul>
    </div>
    <a-modal v-model="visible" title="成为赞助商" @ok="visible = false">
      如果您有品牌推广、活动推广、招聘推广、社区合作等需求，欢迎联系我们，成为赞助商。<br />
      您的广告将出现在 And Design Vue 文档所有子页面及 GitHub Readme 等页面。<br />
      咨询邮箱：<a href="mailto:antdv@foxmail.com">antdv@foxmail.com</a><br />
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
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
      },
      visible: false,
    };
  },
  methods: {
    isEffective({ start, end }) {
      return moment().isBetween(start, end);
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
