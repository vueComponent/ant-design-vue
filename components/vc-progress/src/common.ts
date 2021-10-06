import type { RefsValue } from '../../_util/hooks/useRefs';
import type { Ref } from 'vue';
import { ref, onUpdated } from 'vue';
import type { ProgressProps } from './types';

export const defaultProps: Partial<ProgressProps> = {
  percent: 0,
  prefixCls: 'vc-progress',
  strokeColor: '#2db7f5',
  strokeLinecap: 'round',
  strokeWidth: 1,
  trailColor: '#D9D9D9',
  trailWidth: 1,
};

export const useTransitionDuration = (paths: Ref<RefsValue>) => {
  const prevTimeStamp = ref(null);

  onUpdated(() => {
    const now = Date.now();
    let updated = false;

    paths.value.forEach(val => {
      const path = (val as any)?.$el || val;
      if (!path) {
        return;
      }
      updated = true;
      const pathStyle = path.style;
      pathStyle.transitionDuration = '.3s, .3s, .3s, .06s';

      if (prevTimeStamp.value && now - prevTimeStamp.value < 100) {
        pathStyle.transitionDuration = '0s, 0s';
      }
    });

    if (updated) {
      prevTimeStamp.value = Date.now();
    }
  });

  return paths;
};
