import { inject, provide } from 'vue';

function createContext<T>() {
  const contextKey = Symbol('contextKey');
  const useProvide = (props: T) => {
    provide(contextKey, props);
  };
  const useInject = () => {
    return inject(contextKey, undefined as T) || ({} as T);
  };
  return {
    useProvide,
    useInject,
  };
}

export default createContext;
