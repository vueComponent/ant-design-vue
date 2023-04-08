import isStyleSupport from '../../_util/styleChecker';
import { onMounted, shallowRef } from 'vue';

const supportSticky = shallowRef(false);
export const useProvideSticky = () => {
  onMounted(() => {
    supportSticky.value = supportSticky.value || isStyleSupport('position', 'sticky');
  });
};

export const useInjectSticky = () => {
  return supportSticky;
};
