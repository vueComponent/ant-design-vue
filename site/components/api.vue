<template>
  <div class="markdown api-container">
    <slot v-if="isZhCN" name="cn" />
    <slot v-else />
  </div>
</template>
<script>
import { isZhCN } from '../util';
export default {
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
