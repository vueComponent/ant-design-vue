import { onMounted, shallowRef } from 'vue';
import { detectFlexGapSupported } from '../styleChecker';

export default () => {
  const flexible = shallowRef(false);
  onMounted(() => {
    flexible.value = detectFlexGapSupported();
  });

  return flexible;
};
