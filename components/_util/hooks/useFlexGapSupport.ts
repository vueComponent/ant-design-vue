import { onMounted, ref } from 'vue';
import { detectFlexGapSupported } from '../styleChecker';

export default () => {
  const flexible = ref(false);
  onMounted(() => {
    flexible.value = detectFlexGapSupported();
  });

  return flexible;
};
