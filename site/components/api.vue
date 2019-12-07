<template>
  <div class="markdown api-container">
    <GoogleAds />
    <slot v-if="isZhCN" name="cn" />
    <slot v-else />
  </div>
</template>
<script>
import { isZhCN } from '../util';
import GoogleAds from './GoogleAds';
export default {
  components: {
    GoogleAds,
  },
  name: 'Api',
  inject: {
    demoContext: { default: {} },
  },
  data() {
    return {
      isZhCN: isZhCN(this.demoContext.name),
    };
  },
};
</script>
