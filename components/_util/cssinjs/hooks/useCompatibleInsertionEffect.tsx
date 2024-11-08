// import canUseDom from 'rc-util/lib/Dom/canUseDom';
import useLayoutEffect from '../../../_util/hooks/useLayoutEffect';
import type { ShallowRef, WatchCallback } from 'vue';
import { watch } from 'vue';

type UseCompatibleInsertionEffect = (
  renderEffect: WatchCallback,
  effect: (polyfill?: boolean) => ReturnType<WatchCallback>,
  deps: ShallowRef,
) => void;

/**
 * Polyfill `useInsertionEffect` for React < 18
 * @param renderEffect will be executed in `useMemo`, and do not have callback
 * @param effect will be executed in `useLayoutEffect`
 * @param deps
 */
const useInsertionEffectPolyfill: UseCompatibleInsertionEffect = (renderEffect, effect, deps) => {
  watch(deps, renderEffect, { immediate: true });
  useLayoutEffect(() => effect(true), deps);
};

/**
 * Compatible `useInsertionEffect`
 * will use `useInsertionEffect` if React version >= 18,
 * otherwise use `useInsertionEffectPolyfill`.
 */
const useCompatibleInsertionEffect: UseCompatibleInsertionEffect = useInsertionEffectPolyfill;

export default useCompatibleInsertionEffect;
