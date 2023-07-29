import { computed } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import { isZhCN } from './utils/util';

const i18n = createI18n({
  legacy: false,
  locale: isZhCN(location.pathname) ? 'zh-CN' : 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

/**
 * @description: 传入localMap，根据当前的语言类型输入i18nmessage,只是中英两种
 * @param {object} localeMap  {en:{xxx:xxx},cn:{xxx:xxx} }
 * @return {object} [i18nMessage, localeType]
 */
export function useLocale(localeMap = {}) {
  const { locale } = useI18n();

  const localeType = computed(() => (locale.value === 'zh-CN' ? 'cn' : 'en'));

  const i18nMessage = computed(() => (localeMap && localeMap[localeType.value]) || {});

  return [i18nMessage, localeType];
}

export default i18n;
