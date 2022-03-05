import { onBeforeUnmount, ref } from 'vue';

const useDestroyed = () => {
  const mounted = ref(true);
  onBeforeUnmount(() => {
    mounted.value = false;
  });

  return mounted;
};

export default useDestroyed;
