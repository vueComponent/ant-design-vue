<template>
  <Navigation @langChange="onLangChange" />
  <template v-if="isMobile">
    <Ecosystem />
  </template>
  <template v-else>
    <a-select
      key="version"
      class="version"
      size="small"
      :default-value="antdVersion"
      :get-popup-container="trigger => trigger.parentNode"
    >
      <a-select-option :value="antdVersion">{{ antdVersion }}</a-select-option>
      <a-select-option value="1.x" @click="changeVersion">1.x</a-select-option>
    </a-select>
    <a-button
      key="lang-button"
      size="small"
      class="header-button header-lang-button"
      @click="onLangChange"
    >
      {{ $t('app.header.lang') }}
    </a-button>
    <More />
    <Github />
  </template>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Github from './Github.vue';
import More from './More.vue';
import Navigation from './Navigation.vue';
import Ecosystem from './Ecosystem.vue';
import { version } from 'ant-design-vue';
import { isZhCN, isLocalStorageNameSupported, getLocalizedPathname } from '../../utils/util';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'HeaderMenu',
  components: {
    Navigation,
    Github,
    More,
    Ecosystem,
  },
  props: ['isMobile'],
  setup() {
    const antdVersion = ref(version);
    const route = useRoute();
    const onLangChange = () => {
      const {
        location: { pathname },
      } = window;
      const currentProtocol = `${window.location.protocol}//`;
      const currentHref = window.location.href.substr(currentProtocol.length);

      if (isLocalStorageNameSupported()) {
        localStorage.setItem('locale', isZhCN(pathname) ? 'en-US' : 'zh-CN');
      }

      window.location.href =
        currentProtocol +
        currentHref.replace(
          window.location.pathname,
          getLocalizedPathname(pathname, !isZhCN(pathname)).path,
        );
    };

    const changeVersion = () => {
      location.href = `https://1x.antdv.com${route.fullPath}`;
    };
    return {
      onLangChange,
      antdVersion,
      changeVersion,
    };
  },
});
</script>
<style lang="less" scoped></style>
