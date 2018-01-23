<template>
  <div>
    <a-button type="primary" loading>
      Loading
    </a-button>
    <a-button type="primary" size="small" loading>
      Loading
    </a-button>
    <br />
    <a-button type="primary" :loading="loading" @mouseenter="enterLoading">
      mouseenter me!
    </a-button>
    <a-button type="primary" icon="poweroff" :loading="iconLoading" @click="enterIconLoading">
      延迟1s
    </a-button>
    <br />
    <a-button shape="circle" loading />
    <a-button type="primary" shape="circle" loading />
  </div>
</template>
<script>
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
}
</script>
