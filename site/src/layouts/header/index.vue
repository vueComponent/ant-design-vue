<template>
  <header id="header" :class="headerClassName">
    <div v-if="visibleAdblockBanner" class="adblock-banner">
      <template v-if="isZhCN">
        我们检测到你可能使用了 AdBlock 或 Adblock
        Plus，它会影响到正常功能的使用（如复制、展开代码等）。
        <br />
        你可以将 Ant Design Vue 加入白名单，以便我们更好地提供服务。
      </template>
      <template v-else>
        We have detected that you may use AdBlock or Adblock Plus, which will affect the use of
        normal functions (such as copying, expanding code, etc.)
        <br />
        You can add Ant Design Vue to the whitelist so that we can provide better services.
      </template>

      <CloseOutlined class="close-icon" @click="visibleAdblockBanner = false" />
    </div>
    <a-popover
      v-model:visible="menuVisible"
      overlay-class-name="popover-menu"
      placement="bottomRight"
      trigger="click"
      arrow-point-at-center
    >
      <UnorderedListOutlined class="nav-phone-icon" />
      <template #content>
        <Menu :is-mobile="isMobile" />
      </template>
    </a-popover>
    <a-row :style="{ flexFlow: 'nowrap', height: 64 }">
      <a-col v-bind="colProps[0]">
        <Logo />
      </a-col>
      <a-col v-bind="colProps[1]" class="menu-row">
        <SearchBox
          key="search"
          :is-zh-c-n="isZhCN"
          :responsive="responsive"
          @triggerFocus="onTriggerSearching"
        />
        <Menu v-if="!isMobile" />
      </a-col>
    </a-row>
  </header>
</template>
<script lang="ts">
import type { GlobalConfig } from '../../App.vue';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import { getLocalizedPathname } from '../../utils/util';
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Logo from './Logo.vue';
import Menu from './Menu.vue';
import { UnorderedListOutlined, CloseOutlined } from '@ant-design/icons-vue';
import SearchBox from './SearchBox.vue';
export default defineComponent({
  components: {
    Logo,
    Menu,
    UnorderedListOutlined,
    SearchBox,
    CloseOutlined,
  },
  setup() {
    const route = useRoute();
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isHome = computed(() => {
      return ['', 'index', 'index-cn'].includes(route.path);
    });

    const menuVisible = ref(false);
    const colProps = isHome.value
      ? [{ flex: 'none' }, { flex: 'auto' }]
      : [
          {
            xxl: 4,
            xl: 5,
            lg: 6,
            md: 6,
            sm: 24,
            xs: 24,
          },
          {
            xxl: 20,
            xl: 19,
            lg: 18,
            md: 18,
            sm: 0,
            xs: 0,
          },
        ];
    const searching = ref(false);
    const onTriggerSearching = (value: boolean) => {
      searching.value = value;
    };
    const initDocSearch = () => {
      window.docsearch({
        apiKey: '92003c1d1d07beef165b08446f4224a3',
        indexName: 'antdv',
        inputSelector: '#search-box input',
        algoliaOptions: { facetFilters: [`tags:${globalConfig.isZhCN.value ? 'cn' : 'en'}`] },
        transformData(hits: any[]) {
          hits.forEach(hit => {
            hit.url = hit.url.replace('www.antdv.com', window.location.host);
            hit.url = hit.url.replace('https:', window.location.protocol);
          });
          return hits;
        },
        debug: false, // Set debug to true if you want to inspect the dropdown
      });
    };
    onMounted(() => {
      setTimeout(() => {
        initDocSearch();
      });
    });
    const visibleAdblockBanner = ref(false);
    watch(globalConfig?.blocked, val => {
      visibleAdblockBanner.value = val;
    });
    return {
      isZhCN: globalConfig.isZhCN,
      isMobile: globalConfig.isMobile,
      responsive: globalConfig.responsive,
      getLocalizedPathname,
      visibleAdblockBanner,
      headerClassName: {
        clearfix: true,
        'home-header': isHome.value,
      },
      colProps,
      menuVisible,
      onTriggerSearching,
    };
  },
});
</script>
<style lang="less" src="./index.less"></style>
<style scope>
.adblock-banner {
  position: relative;
  z-index: 100;
  min-width: 1000px;
  padding: 16px;
  line-height: 28px;
  color: #8590a6;
  text-align: center;
  background-color: #ebebeb;
}
.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
