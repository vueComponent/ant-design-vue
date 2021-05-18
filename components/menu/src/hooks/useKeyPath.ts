import { Key } from '../../../_util/type';
import { computed, ComputedRef, inject, InjectionKey, provide } from 'vue';
import { StoreMenuInfo } from './useMenuContext';

const KeyPathContext: InjectionKey<{
  parentEventKeys: ComputedRef<Key[]>;
  parentInfo: StoreMenuInfo;
}> = Symbol('KeyPathContext');

const useInjectKeyPath = () => {
  return inject(KeyPathContext, {
    parentEventKeys: computed(() => []),
    parentInfo: {} as StoreMenuInfo,
  });
};

const useProvideKeyPath = (eventKey: string, menuInfo: StoreMenuInfo) => {
  const { parentEventKeys } = useInjectKeyPath();
  const keys = computed(() => [...parentEventKeys.value, eventKey]);
  provide(KeyPathContext, { parentEventKeys: keys, parentInfo: menuInfo });
  return keys;
};

export { useProvideKeyPath, useInjectKeyPath, KeyPathContext };

export default useProvideKeyPath;
