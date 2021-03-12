<template>
  <div>
    <template v-if="ads.length">
      <a-carousel autoplay>
        <template v-for="ad in ads">
          <a :key="ad.href" :href="ad.href" target="_blank">
            <img style="width: 100%; max-width: 1200px;" :alt="ad.alt || ''" :src="ad.img" />
          </a>
        </template>
      </a-carousel>
    </template>
    <template v-else-if="showGoogleAd">
      <GoogleAdsTop :key="`GoogleAdsTop_${$route.path}`" />
    </template>
  </div>
</template>

<script>
import moment from 'moment';
import GoogleAdsTop from './GoogleAdsTop';
const isEffective = (start, end) => {
  return moment().isBetween(start, end);
};
export default {
  components: {
    GoogleAdsTop,
  },
  props: ['isCN', 'isMobile'],
  data() {
    return {
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
          img: 'https://qn.antdv.com/TheBigRichGroup.png',
          href: 'https://thebigrichgroup.com/',
          visible: isEffective('2020-09-18 17:00:00', '2021-10-11 17:00:00'),
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
