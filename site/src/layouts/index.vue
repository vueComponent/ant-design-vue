<template>
  <Header />
  <div class="main-wrapper">
    <a-row>
      <template v-if="isMobile">
        <a-drawer
          :closable="false"
          placement="left"
          class="drawer drawer-left"
          :visible="visible"
          key="mobile-menu"
          wrapperClassName="drawer-wrapper"
        >
          <Menu :menus="dataSource" :activeMenuItem="activeMenuItem" :isZhCN="isZhCN" />
          <template #handle>
            <div class="drawer-handle" @click="handleClickShowButton">
              <close-outlined v-if="visible" :style="iconStyle" />
              <MenuOutlined v-else :style="iconStyle" />
            </div>
          </template>
        </a-drawer>
      </template>
      <template v-else>
        <a-col :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24" class="main-menu">
          <a-affix>
            <section class="main-menu-inner">
              <Sponsors :isCN="isZhCN" />
              <Menu :menus="dataSource" :activeMenuItem="activeMenuItem" :isZhCN="isZhCN" />
            </section>
          </a-affix>
        </a-col>
      </template>
      <a-col :xxl="20" :xl="19" :lg="18" :md="18" :sm="24" :xs="24">
        <section :class="mainContainerClass">
          <TopAd :isCN="isZhCN" />
          <Demo v-if="isDemo" :pageData="pageData" :isZhCN="isZhCN">
            <component :is="matchCom" />
          </Demo>
          <router-view v-else />
          <a-affix v-if="headers.length" class="toc-affix" :offsetTop="20">
            <a-anchor>
              <a-anchor-link
                v-for="h in headers"
                :key="h.title"
                :href="h.href || `#${h.title}`"
                :title="h.title"
              ></a-anchor-link>
            </a-anchor>
          </a-affix>
        </section>
        <div class="fixed-widgets" :style="isZhCN ? { bottom: '175px' } : {}">
          <a-dropdown placement="topCenter">
            <template #overlay>
              <a-menu
                @click="({ key }) => themeMode.changeTheme(key)"
                :selectedKeys="[themeMode.theme.value]"
              >
                <a-menu-item key="default">{{ $t('app.theme.switch.default') }}</a-menu-item>
                <a-menu-item key="dark">{{ $t('app.theme.switch.dark') }}</a-menu-item>
              </a-menu>
            </template>
            <a-avatar class="fixed-widgets-avatar" :size="44">
              <template #icon><ThemeIcon /></template>
            </a-avatar>
          </a-dropdown>
        </div>
        <PrevAndNext :menus="menus" :currentMenuIndex="currentMenuIndex" />
        <Footer />
      </a-col>
    </a-row>
    <RightBottomAd :isCN="isZhCN" :isMobile="isMobile" />
  </div>
</template>
<script lang="ts">
import { GlobalConfig } from '@/App.vue';
import { GLOBAL_CONFIG } from '@/SymbolKey';
import { defineComponent, inject, computed, ref, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './header/index.vue';
import Footer from './Footer.vue';
import Menu from './Menu.vue';
import PrevAndNext from './PrevAndNext.vue';
import Demo from './Demo.vue';
import useMenus from '@/hooks/useMenus';
import TopAd from '../components/rice/top_rice.vue';
import Sponsors from '../components/rice/sponsors.vue';
import RightBottomAd from '../components/rice/right_bottom_rice.vue';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons-vue';
import ThemeIcon from './ThemeIcon.vue';

export default defineComponent({
  name: 'Layout',
  setup() {
    const visible = ref(false);
    const route = useRoute();
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const { menus, activeMenuItem, currentMenuIndex, dataSource } = useMenus();

    const demos = ref<any[]>([]);

    provide('addDemosInfo', (info: any) => {
      if (!demos.value.find(d => d.href === info.href)) {
        demos.value.push(info);
      }
    });

    const themeMode = inject('themeMode', () => ({
      theme: ref('default'),
      changeTheme: () => void 0,
    }));

    watch(
      () => route.path,
      () => {
        demos.value.length = 0;
      },
    );

    const isDemo = computed(() => {
      return (
        route.path.indexOf('/components') === 0 && route.path.indexOf('/components/overview') !== 0
      );
    });
    const matchCom = computed(() => {
      return route.matched[route.matched.length - 1]?.components?.default as any;
    });
    const isZhCN = globalConfig!.isZhCN;
    const pageData = computed(() =>
      isDemo.value
        ? matchCom.value[isZhCN.value ? 'CN' : 'US']?.pageData
        : matchCom.value?.pageData,
    );
    const headers = computed(() => {
      if (isDemo.value) {
        return [...demos.value, { title: 'API', href: '#API' }];
      } else {
        return (pageData.value?.headers || []).filter((h: Header) => h.level === 2);
      }
    });

    const mainContainerClass = computed(() => {
      return {
        'main-container': true,
        'main-container-component': isDemo.value,
      };
    });
    const handleClickShowButton = () => {
      visible.value = !visible.value;
    };
    return {
      themeMode,
      visible,
      isMobile: globalConfig!.isMobile,
      isZhCN,
      mainContainerClass,
      menus,
      currentMenuIndex,
      activeMenuItem,
      headers,
      isDemo,
      matchCom,
      pageData,
      dataSource,
      handleClickShowButton,
      iconStyle: {
        // color: '#fff',
        fontSize: '20px',
      },
    };
  },
  components: {
    TopAd,
    Sponsors,
    RightBottomAd,
    Demo,
    Header,
    Footer,
    Menu,
    PrevAndNext,
    CloseOutlined,
    MenuOutlined,
    ThemeIcon,
  },
});
</script>
<style lang="less" scoped>
.toc-affix :deep(.ant-anchor) {
  font-size: 12px;
  max-width: 110px;
  .ant-anchor-link {
    border-left: 2px solid #f0f0f0;
    padding: 4px 0 4px 16px;
  }

  .ant-anchor-link-active {
    border-left: 2px solid #1890ff;
  }
  .ant-anchor-ink::before {
    display: none;
  }
  .ant-anchor-ink-ball {
    display: none;
  }
}

[data-theme='dark'] .toc-affix :deep(.ant-anchor) {
  .ant-anchor-link {
    border-left: 2px solid #303030;
  }
  .ant-anchor-link-active {
    border-left: 2px solid #177ddc;
  }
}
</style>
