// copy from https://github.dev/vueuse/vueuse

import type { Ref, WatchOptions, WatchStopHandle } from 'vue';
import { unref, watch } from 'vue';

type MaybeRef<T> = T | Ref<T>;

type Fn = () => void;

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>;
  args: Args;
  thisArg: This;
}

export type EventFilter<Args extends any[] = any[], This = any> = (
  invoke: Fn,
  options: FunctionWrapperOptions<Args, This>,
) => void;

const bypassFilter: EventFilter = invoke => {
  return invoke();
};
/**
 * Create an EventFilter that debounce the events
 *
 * @param ms
 */
export function debounceFilter(ms: MaybeRef<number>) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const filter: EventFilter = invoke => {
    const duration = unref(ms);

    if (timer) clearTimeout(timer);

    if (duration <= 0) return invoke();

    timer = setTimeout(invoke, duration);
  };

  return filter;
}
export interface DebouncedWatchOptions<Immediate> extends WatchOptions<Immediate> {
  debounce?: MaybeRef<number>;
}

interface ConfigurableEventFilter {
  eventFilter?: EventFilter;
}
/**
 * @internal
 */
function createFilterWrapper<T extends FunctionArgs>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: any[]) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args });
  }

  return wrapper as any as T;
}
export interface WatchWithFilterOptions<Immediate>
  extends WatchOptions<Immediate>,
    ConfigurableEventFilter {}
// implementation
export function watchWithFilter<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchStopHandle {
  const { eventFilter = bypassFilter, ...watchOptions } = options;

  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}

// implementation
export default function debouncedWatch<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: DebouncedWatchOptions<Immediate> = {},
): WatchStopHandle {
  const { debounce = 0, ...watchOptions } = options;

  return watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter: debounceFilter(debounce),
  });
}
