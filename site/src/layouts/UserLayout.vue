<template>
  <div :class="$style.container">
    <div :class="$style.lang">中文</div>
    <div :class="$style.content">
      <div :class="$style.top">
        <div :class="$style.header">
          <a to="/">
            <img alt="logo" :class="$style.logo" :src="logo" />
            <span :class="$style.title">Ant Design Vue</span>
          </a>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import logo from '../assets/logo.svg';
export default {
  components: {},
  beforeCreate() {
    this.logo = logo;
  },
};
</script>
<style lang="less" src="./UserLayout.less" module />
