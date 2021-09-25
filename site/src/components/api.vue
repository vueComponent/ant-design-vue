<template>
  <div class="markdown api-container">
    <google-ads v-if="showAd" />
    <slot v-if="isZhCN" name="cn" />
    <slot v-else />
  </div>
</template>
<script lang="ts">
import { isZhCN } from '../utils/util';
import GoogleAds from './rice/GoogleAds.vue';
import { inject } from 'vue';

const showAd = location.host.indexOf('antdv.com') > -1;
export default {
  name: 'Api',
  components: {
    GoogleAds,
  },
  setup() {
    return {
      demoContext: inject('demoContext', {}),
    };
  },
  data() {
    return {
      showAd,
      isZhCN: isZhCN(this.demoContext.name),
    };
  },
};
</script>
