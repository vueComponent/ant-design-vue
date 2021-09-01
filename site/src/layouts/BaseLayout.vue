<template>
  <div>
    <header :name="name" />
    <div style="padding: 20px; margin: 0 auto; width: 960px">
      <router-view />
    </div>
    <footer />
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
