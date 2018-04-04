<template>
  <div class='markdown api-container' id="component-api">
    <slot v-if="isZhCN" name="cn"></slot>
    <slot v-else></slot>
  </div>
</template>
<script>
import { isZhCN } from '../util'
export default {
  name: 'api',
  data () {
    const { name } = this.$route.params
    return {
      isZhCN: isZhCN(name),
    }
  },
}
</script>
