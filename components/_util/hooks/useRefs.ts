import type { Ref, ComponentPublicInstance } from 'vue';
import { onBeforeUpdate, ref } from 'vue';
import type { Key } from '../type';

type RefType = HTMLElement | ComponentPublicInstance;
export type RefsValue = Map<Key, RefType>;
type UseRef = [(key: Key) => (el: RefType) => void, Ref<RefsValue>];
const useRefs = (): UseRef => {
  const refs = ref<RefsValue>(new Map());

  const setRef = (key: Key) => (el: RefType) => {
    refs.value.set(key, el);
  };
  onBeforeUpdate(() => {
    refs.value = new Map();
  });
  return [setRef, refs];
};

export default useRefs;
