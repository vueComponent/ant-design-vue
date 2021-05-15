import { Key } from '../../../_util/type';
import { computed, ComputedRef, getCurrentInstance, inject, InjectionKey, provide } from 'vue';

const KeyPathContext: InjectionKey<ComputedRef<Key[]>> = Symbol('KeyPathContext');

const useInjectKeyPath = () => {
  return inject(
    KeyPathContext,
    computed(() => []),
  );
};

const useProvideKeyPath = () => {
  const parentKeys = useInjectKeyPath();
  const key = getCurrentInstance().vnode.key;
  const keys = computed(() => [...parentKeys.value, key]);
  provide(KeyPathContext, keys);
  return keys;
};

export { useProvideKeyPath, useInjectKeyPath, KeyPathContext };

export default useProvideKeyPath;
