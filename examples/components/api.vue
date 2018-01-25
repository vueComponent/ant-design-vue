<template>
  <div class='markdown'>
    <slot v-if="lang === 'cn'" name="cn"></slot>
    <slot v-else name="us"></slot>
  </div>
</template>
<script>
export default {
  name: 'api',
  data () {
    const { lang } = this.$route.params
    return {
      lang,
    }
  },
}
</script>
