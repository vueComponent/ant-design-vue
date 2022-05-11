import { inject, provide } from 'vue';

function createContext<T>(defaultValue?: T) {
  const contextKey = Symbol('contextKey');
  const useProvide = (props: T) => {
    provide(contextKey, props);
  };
  const useInject = () => {
    return inject(contextKey, defaultValue as T) || ({} as T);
  };
  return {
    useProvide,
    useInject,
  };
}

export default createContext;
