<template>
  <div v-if="show">
    <template v-if="ads.length">
      <a-carousel autoplay>
        <template v-for="ad in ads" :key="ad.href">
          <a :href="ad.href" target="_blank">
            <img style="width: 100%; max-width: 1200px" :alt="ad.alt || ''" :src="ad.img" />
          </a>
        </template>
      </a-carousel>
    </template>
    <template v-else-if="showGoogleAd">
      <!-- <template v-if="isCN">
        <WWAds :key="`WWAds_${$route.path}`" />
      </template> -->
      <google-ads-top :key="`GoogleAdsTop_${$route.path}`" />
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import GoogleAdsTop from './GoogleAdsTop.vue';
// import WWAds from './WWAds.vue';
const isEffective = (start, end) => {
  return dayjs().isBetween(start, end);
};
export default {
  components: {
    GoogleAdsTop,
    // WWAds,
  },
  props: ['isCN', 'isMobile'],
  data() {
    return {
      show: true,
      showGoogleAd: location.host.indexOf('antdv.com') > -1,
      cnAds: [
        {
          img: `https://yidengfe.com/launches/01/yd.png?v=${Date.now()}`,
          href: 'https://yidengfe.com/launches/01/yd.html',
          visible: isEffective('2020-09-11 17:00:00', '2021-03-11 17:00:00'),
        },
      ].filter(ad => ad.visible),
      enAds: [
        {
          img: 'https://aliyuncdn.antdv.com/TheBigRichGroup.png',
          href: 'https://thebigrichgroup.com/',
          visible: isEffective('2020-09-18 17:00:00', '2021-07-09 17:00:00'),
        },
      ].filter(ad => ad.visible),
    };
  },
  computed: {
    ads() {
      return this.isCN ? this.cnAds : this.enAds;
    },
  },
};
</script>

<style lang="less" scoped></style>
