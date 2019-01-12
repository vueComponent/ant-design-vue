<template>
  <div class='markdown api-container'>
    <slot v-if="isZhCN" name="cn"></slot>
    <slot v-else></slot>
  </div>
</template>
<script>
import { isZhCN } from '../util';
export default {
  name: 'api',
  inject: {
    demoContext: { default: {}},
  },
  data () {
    return {
      isZhCN: isZhCN(this.demoContext.name),
    };
  },
};
</script>
