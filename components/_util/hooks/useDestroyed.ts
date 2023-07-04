import { onBeforeUnmount, ref } from 'vue';

const useDestroyed = () => {
  const destroyed = ref(false);
  onBeforeUnmount(() => {
    destroyed.value = true;
  });

  return destroyed;
};

export default useDestroyed;
