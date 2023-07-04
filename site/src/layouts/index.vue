<template>
  <Header />
  <div class="main-wrapper">
    <a-row>
      <template v-if="isMobile">
        <a-drawer
          key="mobile-menu"
          :closable="false"
          placement="left"
          class="drawer drawer-left"
          :visible="visible"
          wrapper-class-name="drawer-wrapper"
          width="60%"
        >
          <surelyVueVue />
          <Menu :menus="dataSource" :active-menu-item="activeMenuItem" :is-zh-c-n="isZhCN" />
          <template #handle>
            <div class="drawer-handle" @click="handleClickShowButton">
              <close-outlined v-if="visible" :style="iconStyle" />
              <MenuOutlined v-else :style="iconStyle" />
            </div>
          </template>
        </a-drawer>
      </template>
      <template v-else>
        <a-col :xxxl="4" :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24" class="main-menu">
          <a-affix>
            <section class="main-menu-inner">
              <!-- <Sponsors :is-c-n="isZhCN" /> -->
              <div>
                <surelyVueVue />
              </div>
              <Menu :menus="dataSource" :active-menu-item="activeMenuItem" :is-zh-c-n="isZhCN" />
            </section>
          </a-affix>
        </a-col>
      </template>
      <a-col :xxxl="20" :xxl="20" :xl="19" :lg="18" :md="18" :sm="24" :xs="24">
        <section :class="mainContainerClass">
          <!-- <TopAd :is-c-n="isZhCN" /> -->
          <WWAdsVue v-if="isZhCN" />
          <Demo v-if="isDemo" :page-data="pageData" :is-zh-c-n="isZhCN">
            <component :is="matchCom" />
          </Demo>
          <router-view v-else />
          <a-affix v-if="headers.length" class="toc-affix" :offset-top="20">
            <a-anchor>
              <a-anchor-link
                v-for="h in headers"
                :key="h.title"
                :href="h.href || `#${slugifyTitle(h.title)}`"
                :target="h.target"
              >
                <template #title>
                  <LinkOutlined v-if="h.target" />
                  {{ isZhCN ? h.title : h.enTitle || h.title }}
                </template>
              </a-anchor-link>
            </a-anchor>
          </a-affix>
        </section>
        <div class="fixed-widgets" :style="isZhCN ? { bottom: '175px' } : {}">
          <a-dropdown placement="top">
            <template #overlay>
              <a-menu
                :selected-keys="[themeMode.theme.value]"
                @click="({ key }) => themeMode.changeTheme(key)"
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
        <PrevAndNext :menus="menus" :current-menu-index="currentMenuIndex" :is-zh-c-n="isZhCN" />
        <Footer />
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import type { GlobalConfig } from '../App.vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import { defineComponent, inject, computed, ref, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './header/index.vue';
import Footer from './Footer.vue';
import Menu from './Menu.vue';
import PrevAndNext from './PrevAndNext.vue';
import Demo from './Demo.vue';
import useMenus from '../hooks/useMenus';
import TopAd from '../components/rice/top_rice.vue';
import Sponsors from '../components/rice/sponsors.vue';
import RightBottomAd from '../components/rice/right_bottom_rice.vue';
import { CloseOutlined, MenuOutlined, LinkOutlined } from '@ant-design/icons-vue';
import ThemeIcon from './ThemeIcon.vue';
import surelyVueVue from '../components/surelyVue.vue';
import WWAdsVue from '../components/rice/WWAds.vue';

const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g;

export default defineComponent({
  name: 'Layout',
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
    surelyVueVue,
    WWAdsVue,
    LinkOutlined,
  },
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

    const themeMode = inject('themeMode', {
      theme: ref('default'),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      changeTheme: (_key: any) => void 0,
    });

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
    const isTablePage = computed(() => {
      return route.path.indexOf('/components/table') === 0;
    });
    const matchCom = computed(() => {
      return route.matched[route.matched.length - 1]?.components?.default;
    });
    const isZhCN = globalConfig.isZhCN;
    const pageData = computed(() =>
      isDemo.value
        ? matchCom.value[isZhCN.value ? 'CN' : 'US']?.pageData
        : (matchCom.value as any)?.pageData,
    );
    const headers = computed(() => {
      let tempHeaders = (pageData.value?.headers || []).filter((h: Header) => h.level === 2);
      if (isDemo.value) {
        tempHeaders = [...demos.value];
        if (isTablePage.value) {
          tempHeaders.push(
            ...[
              {
                title: '大数据渲染',
                enTitle: 'Virtualized Table',
                href: 'https://surely.cool/doc/performance',
                target: '_blank',
              },
              {
                title: '行拖拽排序',
                enTitle: 'Row Drag Sort',
                href: 'https://surely.cool/doc/dragable#drag-row',
                target: '_blank',
              },
              {
                title: '列拖拽排序',
                enTitle: 'Column Drag Sort',
                href: 'https://surely.cool/doc/dragable#drag-column',
                target: '_blank',
              },
              {
                title: '更多高性能示例',
                enTitle: 'More high-performance examples ',
                href: 'https://surely.cool',
                target: '_blank',
              },
            ],
          );
        }
        tempHeaders.push({ title: 'API', href: '#API' });
      }

      return tempHeaders;
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
      slugifyTitle: (str: string) => {
        return (
          str
            // Remove control characters
            .replace(rControl, '')
            // Replace special characters
            .replace(rSpecial, '-')
            // Remove continuos separators
            .replace(/\-{2,}/g, '-')
            // Remove prefixing and trailing separtors
            .replace(/^\-+|\-+$/g, '')
            // ensure it doesn't start with a number (#121)
            .replace(/^(\d)/, '_$1')
        );
      },
      themeMode,
      visible,
      isMobile: globalConfig.isMobile,
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
