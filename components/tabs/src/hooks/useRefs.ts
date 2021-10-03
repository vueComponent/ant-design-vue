import type { Ref, ComponentPublicInstance } from 'vue';
import { ref } from 'vue';
import type { Key } from '../../../_util/type';

export default function useRefs(): [
  (key: Key) => Ref<HTMLElement | ComponentPublicInstance>,
  (key: Key) => void,
] {
  const cacheRefs = ref(new Map<Key, Ref<HTMLElement | ComponentPublicInstance>>());

  function getRef(key: Key) {
    if (!cacheRefs.value.has(key)) {
      cacheRefs.value.set(key, ref());
    }
    return cacheRefs.value.get(key);
  }

  function removeRef(key: Key) {
    cacheRefs.value.delete(key);
  }

  return [getRef, removeRef];
}
