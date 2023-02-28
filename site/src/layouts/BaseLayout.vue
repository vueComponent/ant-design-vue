<template>
  <div>
    <HeaderCom />
    <div style="padding: 20px; margin: 0 auto; width: 960px">
      <slot></slot>
    </div>
    <FooterCom />
  </div>
</template>

<script>
import Header from './header/index.vue';
import Footer from './Footer.vue';
import NProgress from 'nprogress';
export default {
  components: {
    HeaderCom: Header,
    FooterCom: Footer,
  },
  props: ['name'],
  beforeCreate() {},
  methods: {
    mountedCallback() {
      NProgress.done();
      document.documentElement.scrollTop = 0;
    },
  },
};
</script>
