<template>
  <h1>
    <a id="logo" :href="isZhCN ? '/index-cn' : '/index'">
      <img alt="logo" :src="logo" />
      Ant Design Vue
    </a>
  </h1>
</template>

<script lang="ts">
import type { GlobalConfig } from '../../App.vue';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import { defineComponent, inject } from 'vue';
import logo from '../../assets/logo.svg';
export default defineComponent({
  setup() {
    return { logo, isZhCN: inject<GlobalConfig>(GLOBAL_CONFIG).isZhCN.value };
  },
});
</script>

<style lang="less" scoped>
@import '../../theme/static/theme.less';
@import './index.less';

#logo {
  height: @header-height;
  padding-left: 40px;
  overflow: hidden;
  color: @site-heading-color;
  font-size: 18px;
  font-family: Avenir, @font-family, sans-serif;
  line-height: @header-height;
  white-space: nowrap;
  text-decoration: none;

  .ant-row-rtl & {
    float: right;
    padding-right: 40px;
    padding-left: 0;
  }

  img {
    position: relative;
    top: -1.5px;
    height: 32px;
    margin-right: 16px;

    .ant-row-rtl & {
      margin-right: 0;
      margin-left: 16px;
    }
  }
}

@media only screen and (max-width: @mobile-max-width) {
  #logo {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
