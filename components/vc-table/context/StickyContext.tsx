import isStyleSupport from '../../_util/styleChecker';
import { onMounted, ref } from 'vue';

const supportSticky = ref(false);
export const useProvideSticky = () => {
  onMounted(() => {
    supportSticky.value = supportSticky.value || isStyleSupport('position', 'sticky');
  });
};

export const useInjectSticky = () => {
  return supportSticky;
};
