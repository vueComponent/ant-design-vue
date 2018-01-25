<template>
  <div class='markdown api-container'>
    <slot v-if="lang === 'cn'" name="cn" class='markdown api-container'></slot>
    <slot v-else></slot>
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
