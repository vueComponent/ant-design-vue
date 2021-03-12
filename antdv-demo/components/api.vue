<template>
  <div class="markdown api-container">
    <google-ads v-if="showAd" />
    <slot v-if="isZhCN" name="cn" />
    <slot v-else />
  </div>
</template>
<script>
import { isZhCN } from '../utils/util';
import GoogleAds from './GoogleAds';

const showAd = location.host.indexOf('antdv.com') > -1;
export default {
  name: 'Api',
  components: {
    GoogleAds,
  },
  inject: {
    demoContext: { default: {} },
  },
  data() {
    return {
      showAd,
      isZhCN: isZhCN(this.demoContext.name),
    };
  },
};
</script>
