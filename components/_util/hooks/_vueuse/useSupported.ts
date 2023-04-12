import { tryOnMounted } from './tryOnMounted';
import { shallowRef } from 'vue';

export function useSupported(callback: () => unknown, sync = false) {
  const isSupported = shallowRef<boolean>();

  const update = () => (isSupported.value = Boolean(callback()));

  update();

  tryOnMounted(update, sync);
  return isSupported;
}
