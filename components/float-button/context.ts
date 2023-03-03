import type { Ref, InjectionKey } from 'vue';
import { inject, provide, ref } from 'vue';

import type { FloatButtonShape } from './interface';

interface FloatButtonGroupContext {
  shape: Ref<FloatButtonShape>;
}
const contextKey: InjectionKey<FloatButtonGroupContext> = Symbol('floatButtonGroupContext');

export const useProvideFloatButtonGroupContext = (props: FloatButtonGroupContext) => {
  provide(contextKey, props);

  return props;
};

export const useInjectFloatButtonGroupContext = () => {
  return inject(contextKey, { shape: ref() } as FloatButtonGroupContext);
};
