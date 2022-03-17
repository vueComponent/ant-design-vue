import type { Ref } from 'vue';
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import type { ScreenMap } from '../../_util/responsiveObserve';
import ResponsiveObserve from '../../_util/responsiveObserve';

function useBreakpoint(refreshOnChange = ref(true)): Ref<ScreenMap> {
  const screens = ref<ScreenMap>({});
  let token = null;
  const instance = getCurrentInstance();
  onMounted(() => {
    token = ResponsiveObserve.subscribe(supportScreens => {
      screens.value = supportScreens;
      if (refreshOnChange?.value) {
        instance.update();
      }
    });
  });

  onUnmounted(() => {
    ResponsiveObserve.unsubscribe(token);
  });

  return screens;
}

export default useBreakpoint;
