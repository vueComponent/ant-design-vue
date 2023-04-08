import { onBeforeUnmount, shallowRef } from 'vue';

const useDestroyed = () => {
  const destroyed = shallowRef(false);
  onBeforeUnmount(() => {
    destroyed.value = true;
  });

  return destroyed;
};

export default useDestroyed;
