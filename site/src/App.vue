<template>
  <a-config-provider :locale="locale" :theme="themeConfig">
    <SiteToken>
      <router-view />
    </SiteToken>
  </a-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, provide, watch, ref } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useMediaQuery from './hooks/useMediaQuery';
import { GLOBAL_CONFIG } from './SymbolKey';
import enUS from '../../components/locale/en_US';
import zhCN from '../../components/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { theme as antdTheme } from 'ant-design-vue';
import SiteToken from './SiteToken.vue';
function isZhCN(name: string) {
  return /-cn\/?$/.test(name);
}
export interface GlobalConfig {
  isMobile: Ref<boolean>;
  lang: Ref<'zh-CN' | 'en-US'>;
  isZhCN: Ref<boolean>;
  responsive: Ref<null | 'narrow' | 'crowded'>;
  blocked: Ref<boolean>;
}
export type ThemeName = 'light' | 'dark' | 'compact';
const getAlgorithm = (themes: ThemeName[] = []) =>
  themes.map(theme => {
    if (theme === 'dark') {
      return antdTheme.darkAlgorithm;
    }
    if (theme === 'compact') {
      return antdTheme.compactAlgorithm;
    }
    return antdTheme.defaultAlgorithm;
  });

export default defineComponent({
  components: {
    SiteToken,
  },
  setup() {
    const route = useRoute();
    const i18n = useI18n();
    const colSize = useMediaQuery();
    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs');
    const theme = ref<ThemeName>((localStorage.getItem('theme') as ThemeName) || 'light');
    const themeConfig = computed(() => {
      return { algorithm: getAlgorithm([theme.value]) };
    });
    // useSiteToken();
    const responsive = computed(() => {
      if (colSize.value === 'xs') {
        return 'crowded';
      } else if (colSize.value === 'sm') {
        return 'narrow';
      }
      return null;
    });
    const globalConfig: GlobalConfig = {
      isMobile,
      responsive,
      lang: computed<any>(() => i18n.locale.value),
      isZhCN: computed(() => i18n.locale.value === 'zh-CN'),
      blocked: ref(false),
    };
    const changeTheme = (t: ThemeName) => {
      theme.value = t;
      localStorage.setItem('theme', t);
    };
    provide('themeMode', {
      theme,
      changeTheme,
    });
    provide(GLOBAL_CONFIG, globalConfig);
    watch(
      () => route.path,
      val => {
        i18n.locale.value = isZhCN(val) ? 'zh-CN' : 'en-US';
      },
      { immediate: true },
    );
    watch(
      globalConfig.isZhCN,
      val => {
        if (val) {
          dayjs.locale(zhCN.locale);
        } else {
          dayjs.locale(enUS.locale);
        }
      },
      { immediate: true },
    );
    const locale = computed(() => {
      return globalConfig.isZhCN.value ? zhCN : enUS;
    });
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'adsbox';
      document.body.appendChild(div);
      globalConfig.blocked.value = 'none' === getComputedStyle(div).display;
    }, 300);
    watch(
      theme,
      () => {
        if (theme.value === 'dark') {
          document.getElementsByTagName('html')[0].setAttribute('data-doc-theme', 'dark');
          document.getElementsByTagName('body')[0].setAttribute('data-theme', 'dark');
          document.getElementsByTagName('html')[0].style.colorScheme = 'dark';
        } else {
          document.getElementsByTagName('html')[0].setAttribute('data-doc-theme', 'light');
          document.getElementsByTagName('body')[0].setAttribute('data-theme', 'light');
          document.getElementsByTagName('html')[0].style.colorScheme = 'light';
        }
      },
      { immediate: true },
    );
    return { globalConfig, locale, themeConfig };
  },
});
</script>
