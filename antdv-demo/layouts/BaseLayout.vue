<template>
  <div>
    <Header :name="name" />
    <div style="padding: 20px;margin: 0 auto;width: 960px;">
      <router-view v-mountedCallback="mountedCallback" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/header';
import Footer from '../components/footer';
import NProgress from 'nprogress';
export default {
  components: {
    Header,
    Footer,
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
