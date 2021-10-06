import type { Ref, ComponentPublicInstance } from 'vue';
import { onBeforeUpdate, ref } from 'vue';

type RefType = HTMLElement | ComponentPublicInstance;
export type Refs = Record<string | number, RefType>;
export type UseRef = [(el: RefType, key: string | number) => void, Ref<Refs>];
export const useRef = (): UseRef => {
  const refs = ref<Refs>({});
  const setRef = (el: RefType, key: string | number) => {
    refs.value[key] = el;
  };
  onBeforeUpdate(() => {
    refs.value = {};
  });
  return [setRef, refs];
};

export default useRef;
