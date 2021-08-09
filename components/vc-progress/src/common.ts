import type { Refs } from '../../_util/hooks/useRef';
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

export const useTransitionDuration = (paths: Refs) => {
  const prevTimeStamp = ref(null);

  onUpdated(() => {
    const now = Date.now();
    let updated = false;

    Object.keys(paths.value).forEach(key => {
      const path = paths.value[key];
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
