<template>
  <div>
    <AntButton type="primary" loading>
      Loading
    </AntButton>
    <AntButton type="primary" size="small" loading>
      Loading
    </AntButton>
    <br />
    <AntButton type="primary" :loading="loading" @mouseenter="enterLoading">
      mouseenter me!
    </AntButton>
    <AntButton type="primary" icon="poweroff" :loading="iconLoading" @click="enterIconLoading">
      延迟1s
    </AntButton>
    <br />
    <AntButton shape="circle" loading />
    <AntButton type="primary" shape="circle" loading />
  </div>
</template>
<script>
import { Button } from 'antd'
export default {
  data () {
    return {
      loading: false,
      iconLoading: false,
    }
  },
  methods: {
    enterLoading () {
      this.loading = true
    },
    enterIconLoading () {
      this.iconLoading = { delay: 1000 }
    },
  },
  components: {
    AntButton: Button,
  },
}
</script>
