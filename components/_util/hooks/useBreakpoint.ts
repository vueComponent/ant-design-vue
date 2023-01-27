import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';
import type { ScreenMap } from '../../_util/responsiveObserve';
import useResponsiveObserve from '../../_util/responsiveObserve';

function useBreakpoint(): Ref<ScreenMap> {
  const screens = ref<ScreenMap>({});
  let token = null;
  const responsiveObserve = useResponsiveObserve();

  onMounted(() => {
    token = responsiveObserve.value.subscribe(supportScreens => {
      screens.value = supportScreens;
    });
  });

  onUnmounted(() => {
    responsiveObserve.value.unsubscribe(token);
  });

  return screens;
}

export default useBreakpoint;
