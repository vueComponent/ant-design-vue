<template>
  <header id="header" :class="headerClassName">
    <a-row :style="{ flexFlow: 'nowrap', height: 64, position: 'relative' }">
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
      <a-popover
        v-model:open="menuOpen"
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
    </a-row>
    <a-modal
      title="新版发布，邀您体验"
      :open="visibleAlertBanner"
      :footer="null"
      @update:open="visibleAlertBanner = false"
    >
      <ul>
        <li class="alert-list-item">
          <strong>Ant Design Vue 4</strong>
          ：五大新组件，全新 Design Token
        </li>
        <li class="alert-list-item">
          <strong>Surely Table</strong>
          ：支持高性能编辑模式了
          <a target="_blank" href="https://www.surelyvue.com/">立即体验</a>
        </li>
        <li class="alert-list-item">
          <strong>Admin Pro</strong>
          ：已同步更新 v4 版本
          <a target="_blank" href="https://store.antdv.com/pro/preview/workplace">立即体验</a>
        </li>
      </ul>
    </a-modal>
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
import { UnorderedListOutlined } from '@ant-design/icons-vue';
import SearchBox from './SearchBox.vue';
import { version } from 'ant-design-vue';
export default defineComponent({
  components: {
    Logo,
    Menu,
    UnorderedListOutlined,
    SearchBox,
    // CloseOutlined,
  },
  setup() {
    const route = useRoute();
    const cancelButtonProps: any = {
      style: { display: 'none' },
    };
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isHome = computed(() => {
      return ['', 'index', 'index-cn'].includes(route.path);
    });

    const menuOpen = ref(false);
    const colProps = isHome.value
      ? [{ flex: 'none' }, { flex: 'auto' }]
      : [
          {
            xxxl: 4,
            xxl: 4,
            xl: 5,
            lg: 6,
            md: 6,
            sm: 24,
            xs: 24,
          },
          {
            xxxl: 20,
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
    // const alertKey = 'ant-design-vue-4-alert';
    const visibleAlertBanner = ref(false);
    // watch(visibleAlertBanner, () => {
    //   if (!visibleAlertBanner.value) {
    //     localStorage.setItem(alertKey, version);
    //   }
    // });
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
      menuOpen,
      onTriggerSearching,
      visibleAlertBanner,
      cancelButtonProps,
    };
  },
});
</script>
<style lang="less" src="./index.less"></style>
<style scope>
.adblock-banner,
.alert-banner {
  position: relative;
  z-index: 100;
  padding: 16px;
  line-height: 28px;
  color: #8590a6;
  text-align: center;
  background-color: #141414;
}
.alert-banner {
  color: #fff;
  padding: 5px;
}
.alert-banner a {
  color: #fff;
  text-decoration: underline;
}
.alert-banner .close-icon {
  top: 12px;
}
.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
}
.alert-list-item {
  padding: 8px 0;
}
</style>
