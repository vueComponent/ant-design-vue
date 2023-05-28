import { createI18n } from 'vue-i18n';
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import { isZhCN } from './utils/util';

const i18n = createI18n({
  legacy: true,
  locale: isZhCN(location.pathname) ? 'zh-CN' : 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

export default i18n;
