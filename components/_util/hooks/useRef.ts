import { onBeforeUpdate, readonly, ref, DeepReadonly, UnwrapRef } from 'vue';

export type UseRef = [(el: any) => void, DeepReadonly<UnwrapRef<any[]>>];

export const useRef = (): UseRef => {
  const refs = ref<any>([]);
  const setRef = (el: any) => {
    refs.value.push(el);
  };
  onBeforeUpdate(() => {
    refs.value = [];
  });
  return [setRef, readonly(refs)];
};
