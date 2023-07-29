import type { Ref, InjectionKey } from 'vue';
import { inject, provide, computed } from 'vue';

import type { Locale } from './interface';
import zhCN from './zh-CN';

const contextKey: InjectionKey<Ref<Locale>> = Symbol('localeContext');

export const useProvideLocaleContext = (props: Ref<Locale>) => {
  provide(contextKey, props);
  return props;
};

export const useInjectLocaleContext = () => {
  return inject(
    contextKey,
    computed(() => zhCN),
  );
};
