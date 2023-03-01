import type { Ref } from 'vue';
import { inject, provide } from 'vue';

import type { FloatButtonShape } from './interface';

function createContext<T extends Record<string, any>>(defaultValue?: T) {
  const contextKey = Symbol('floatButtonGroupContext');

  const useProvide = (props: T) => {
    provide(contextKey, props);

    return props;
  };

  const useInject = () => {
    return inject(contextKey, defaultValue as T) || ({} as T);
  };

  return {
    useProvide,
    useInject,
  };
}

const FloatButtonGroupContext = createContext<{ shape: Ref<FloatButtonShape> } | undefined>(
  undefined,
);

export default FloatButtonGroupContext;
