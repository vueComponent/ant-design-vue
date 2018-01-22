<template>
<div>
<Components/>
</div>
</template>
<script>
import { Menu } from 'antd'
export default {
  data () {
    console.log('routes', this.$route.params)
    return {}
  },
  components: {
    Menu,
    'Components': () => {
      console.log(this.$route)
      const { name, demo } = this.$route.params
      return import(`../components/${name}/demo/index.vue`)
    },
  },
}
</script>
