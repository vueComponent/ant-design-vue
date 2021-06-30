import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';
import type { ScreenMap } from '../../_util/responsiveObserve';
import ResponsiveObserve from '../../_util/responsiveObserve';

function useBreakpoint(): Ref<ScreenMap> {
  const screens = ref<ScreenMap>({});
  let token = null;

  onMounted(() => {
    token = ResponsiveObserve.subscribe(supportScreens => {
      screens.value = supportScreens;
    });
  });

  onUnmounted(() => {
    ResponsiveObserve.unsubscribe(token);
  });

  return screens;
}

export default useBreakpoint;
