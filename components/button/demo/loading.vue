<template>
  <div>
    <AntButton type="primary" loading>
      Loading
    </AntButton>
    <AntButton type="primary" size="small" loading>
      Loading
    </AntButton>
    <br />
    <AntButton type="primary" :loading="loading" @click="enterLoading">
      Click me!
    </AntButton>
    <AntButton type="primary" icon="poweroff" :loading="iconLoading" @click="enterIconLoading">
      Click me!
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
      this.iconLoading = true
    },
  },
  components: {
    AntButton: Button,
  },
}
</script>
