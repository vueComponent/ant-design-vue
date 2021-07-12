import type { Ref } from 'vue';
import { onBeforeUpdate, ref } from 'vue';

export type UseRef = [(el: any, key: string | number) => void, Ref<any>];
export type Refs = Record<string | number, any>;
export const useRef = (): UseRef => {
  const refs = ref<Refs>({});
  const setRef = (el: any, key: string | number) => {
    refs.value[key] = el;
  };
  onBeforeUpdate(() => {
    refs.value = {};
  });
  return [setRef, refs];
};

export default useRef;
