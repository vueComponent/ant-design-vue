import type { Key } from '../../../_util/type';
import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide } from 'vue';
import type { StoreMenuInfo } from './useMenuContext';

const KeyPathContext: InjectionKey<{
  parentEventKeys: ComputedRef<string[]>;
  parentKeys: ComputedRef<Key[]>;
  parentInfo: StoreMenuInfo;
}> = Symbol('KeyPathContext');

const useInjectKeyPath = () => {
  return inject(KeyPathContext, {
    parentEventKeys: computed(() => []),
    parentKeys: computed(() => []),
    parentInfo: {} as StoreMenuInfo,
  });
};

const useProvideKeyPath = (eventKey: string, key: Key, menuInfo: StoreMenuInfo) => {
  const { parentEventKeys, parentKeys } = useInjectKeyPath();
  const eventKeys = computed(() => [...parentEventKeys.value, eventKey]);
  const keys = computed(() => [...parentKeys.value, key]);
  provide(KeyPathContext, { parentEventKeys: eventKeys, parentKeys: keys, parentInfo: menuInfo });
  return keys;
};

export { useProvideKeyPath, useInjectKeyPath, KeyPathContext };

export default useProvideKeyPath;
