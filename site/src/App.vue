<template>
  <a-config-provider :locale="locale">
    <router-view />
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
export default defineComponent({
  setup() {
    const route = useRoute();
    const i18n = useI18n();
    const colSize = useMediaQuery();
    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs');
    const theme = ref(localStorage.getItem('theme') || 'default');
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
    const changeTheme = (t: string) => {
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
        } else {
          document.getElementsByTagName('html')[0].setAttribute('data-doc-theme', 'light');
          document.getElementsByTagName('body')[0].setAttribute('data-theme', 'light');
        }
      },
      { immediate: true },
    );
    return { globalConfig, locale };
  },
});
</script>
