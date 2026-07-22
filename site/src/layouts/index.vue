<template>
  <TopAd :is-c-n="isZhCN" />
  <Header />
  <div v-if="headers.length" class="toc-affix" :style="y > 102 ? 'position:fixed; top: 16px;' : ''">
    <a-anchor style="width: 160px" :items="headers">
      <template #customTitle="item">
        <LinkOutlined v-if="item.target" />
        {{ item.title }}
      </template>
    </a-anchor>
    <a v-if="isAdVisible" :href="'https://mentorbook.ai'" target="_blank" style="">
      <img
        :src="isZhCN ? '/MPU_176x250_bf_zh.svg' : '/MPU_176x250_bf_en.svg'"
        style="width: 152px; display: block; margin-top: 16px"
      />
    </a>
    <a class="pireel-card" href="https://github.com/pireel/pireel" target="_blank" rel="noopener">
      <span class="pireel-logo">
        <span class="pireel-play" />
        Pireel
      </span>
      <span class="pireel-desc">
        {{ isZhCN ? '开源 AI 视频剪辑智能体' : 'Open-source AI video editing agent' }}
      </span>
      <span class="pireel-timeline">
        <span class="pireel-track">
          <i class="pireel-clip-amber" />
          <i class="pireel-clip-teal" />
          <i class="pireel-clip-coral" />
        </span>
        <span class="pireel-track">
          <i class="pireel-clip-dim-long" />
          <i class="pireel-clip-dim-short" />
        </span>
        <span class="pireel-marker" />
      </span>
    </a>
  </div>
  <div class="main-wrapper">
    <a-row>
      <template v-if="isMobile">
        <a-drawer
          key="mobile-menu"
          v-model:open="visible"
          :closable="false"
          placement="left"
          class="drawer drawer-left"
          wrapper-class-name="drawer-wrapper"
          width="60%"
        >
          <surelyVueVue />
          <Menu :menus="dataSource" :active-menu-item="activeMenuItem" :is-zh-c-n="isZhCN" />
        </a-drawer>
        <div class="drawer-handle" @click="handleClickShowButton">
          <close-outlined v-if="visible" :style="iconStyle" />
          <MenuOutlined v-else :style="iconStyle" />
        </div>
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
          <Demo v-if="isDemo" :page-data="pageData" :is-zh-c-n="isZhCN">
            <component :is="matchCom" />
          </Demo>
          <router-view v-else />
        </section>
        <a-float-button-group trigger="click">
          <template #icon>
            <ThemeIcon />
          </template>
          <a-float-button
            :tooltip="$t('app.floatButton.theme-editor')"
            @click="$router.push(isZhCN ? '/theme-editor-cn' : '/theme-editor')"
          >
            <template #icon>
              <ThemeEditorIcon />
            </template>
          </a-float-button>
          <a-float-button
            :tooltip="$t('app.floatButton.dark-theme')"
            :type="themeMode.theme.value === 'dark' ? 'primary' : 'default'"
            @click="themeMode.changeTheme(themeMode.theme.value === 'dark' ? 'light' : 'dark')"
          >
            <template #icon>
              <DarkIcon />
            </template>
          </a-float-button>
          <a-float-button
            :tooltip="$t('app.floatButton.compact-theme')"
            :type="themeMode.compactTheme.value === 'compact' ? 'primary' : 'default'"
            @click="
              themeMode.changeCompactTheme(
                themeMode.compactTheme.value === 'compact' ? '' : 'compact',
              )
            "
          >
            <template #icon>
              <CompactIcon />
            </template>
          </a-float-button>
        </a-float-button-group>
        <PrevAndNext :menus="menus" :current-menu-index="currentMenuIndex" :is-zh-c-n="isZhCN" />
        <Footer />
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
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
import ThemeIcon from './icons/ThemeIcon.vue';
import ThemeEditorIcon from './icons/ThemeEditorIcon';
import DarkIcon from './icons/Dark';
import CompactIcon from './icons/Compact';
import surelyVueVue from '../components/surelyVue.vue';
import WWAdsVue from '../components/rice/WWAds.vue';
import { useWindowScroll } from '@vueuse/core';
import type { GlobalConfig } from '../type';

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
    ThemeEditorIcon,
    DarkIcon,
    CompactIcon,
    surelyVueVue,
    WWAdsVue,
    LinkOutlined,
  },
  setup() {
    const { y } = useWindowScroll();
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
      theme: ref('light'),
      compactTheme: ref('light'),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      changeTheme: (_key: any) => void 0,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      changeCompactTheme: (_key: any) => void 0,
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
    const slugifyTitle = (str: string) => {
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
    };
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
                href: 'https://surelyvue.com/doc/performance',
                target: '_blank',
              },
              {
                title: '行拖拽排序',
                enTitle: 'Row Drag Sort',
                href: 'https://surelyvue.com/doc/dragable#drag-row',
                target: '_blank',
              },
              {
                title: '列拖拽排序',
                enTitle: 'Column Drag Sort',
                href: 'https://surelyvue.com/doc/dragable#drag-column',
                target: '_blank',
              },
              {
                title: '更多高性能示例',
                enTitle: 'More high-performance examples ',
                href: 'https://surelyvue.com',
                target: '_blank',
              },
            ],
          );
        }
        tempHeaders.push({ title: 'API', href: '#api' });
      }

      return tempHeaders.map(header => ({
        ...header,
        key: header.title,
        title: isZhCN.value ? header.title : header.enTitle || header.title,
        href: (header.href || `#${slugifyTitle(header.title)}`).toLocaleLowerCase(),
      }));
    });

    const mainContainerClass = computed(() => {
      return {
        'main-container': true,
        'main-container-component': isDemo.value,
      };
    });
    const isAdVisible = computed(() => {
      const now = new Date();
      const startDate = new Date('2025-11-24T00:00:00');
      const endDate = new Date('2025-11-30T23:59:59');
      return now >= startDate && now <= endDate;
    });
    const handleClickShowButton = () => {
      visible.value = !visible.value;
    };
    return {
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
      isAdVisible,
      iconStyle: {
        // color: '#fff',
        fontSize: '20px',
      },
      y,
    };
  },
});
</script>
<style lang="less" scoped>
.toc-affix {
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(10px);
}

.toc-affix .pireel-card {
  position: relative;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 16px;
  padding: 12px 12px 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #fff;
  background: radial-gradient(130% 100% at 100% 0%, rgba(255, 178, 36, 0.24), transparent 55%),
    radial-gradient(120% 120% at 0% 100%, rgba(45, 212, 191, 0.2), transparent 55%), #0d0f15;
  box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.55);
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 178, 36, 0.55);
    box-shadow: 0 14px 30px -10px rgba(0, 0, 0, 0.65);
    color: #fff;
  }

  .pireel-logo {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .pireel-play {
    flex: none;
    position: relative;
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background: linear-gradient(135deg, #ffb224, #ff6b6b);

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 55%;
      transform: translate(-50%, -50%);
      border: 5px solid transparent;
      border-left: 8px solid #fff;
      border-right: none;
    }
  }

  .pireel-desc {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.72);
  }

  .pireel-timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed rgba(255, 255, 255, 0.14);
  }

  .pireel-track {
    display: flex;
    gap: 4px;

    i {
      height: 8px;
      border-radius: 2px;
    }
  }

  .pireel-clip-amber {
    width: 44px;
    background: #ffb224;
  }

  .pireel-clip-teal {
    width: 26px;
    background: #2dd4bf;
  }

  .pireel-clip-coral {
    width: 38px;
    background: #ff6b6b;
  }

  .pireel-clip-dim-long {
    width: 58px;
    background: rgba(45, 212, 191, 0.35);
  }

  .pireel-clip-dim-short {
    width: 30px;
    background: rgba(255, 255, 255, 0.22);
  }

  .pireel-marker {
    position: absolute;
    top: 6px;
    bottom: -2px;
    left: 2%;
    width: 2px;
    border-radius: 1px;
    background: #fff;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
    animation: pireel-sweep 4.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: -2px;
      width: 6px;
      height: 6px;
      border-radius: 2px;
      background: #fff;
    }
  }
}

@keyframes pireel-sweep {
  0% {
    left: 2%;
  }
  50% {
    left: 96%;
  }
  100% {
    left: 2%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toc-affix .pireel-card .pireel-marker {
    animation: none;
    left: 40%;
  }
}

.toc-affix :deep(.ant-anchor) {
  font-size: 12px;
  max-width: 110px;

  .ant-anchor-ink::before {
    display: none;
  }
  .ant-anchor-ink-ball {
    display: none;
  }
}
</style>
