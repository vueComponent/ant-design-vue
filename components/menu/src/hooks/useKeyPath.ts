import type { Key } from '../../../_util/type';
import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide, defineComponent } from 'vue';
import type { StoreMenuInfo } from './useMenuContext';

export const OVERFLOW_KEY = '$$__vc-menu-more__key';
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

const measure = Symbol('measure');
export const PathContext = defineComponent({
  compatConfig: { MODE: 3 },
  setup(_props, { slots }) {
    // 不需要响应式
    provide(measure, true);
    return () => slots.default?.();
  },
});

export const useMeasure = () => {
  return inject(measure, false);
};

export { useProvideKeyPath, useInjectKeyPath, KeyPathContext };

export default useProvideKeyPath;
