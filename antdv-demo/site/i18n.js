import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enUS from '../locale/en-US';
import zhCN from '../locale/zh-CN';
import { isZhCN } from '../utils/util';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: isZhCN(location.pathname) ? 'zh-CN' : 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

export default i18n;
