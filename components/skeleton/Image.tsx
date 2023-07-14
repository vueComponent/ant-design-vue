import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import type { SkeletonElementProps } from './Element';
import { skeletonElementProps } from './Element';
import useStyle from './style';

export type SkeletonImageProps = Omit<SkeletonElementProps, 'size' | 'shape' | 'active'>;

const path =
  'M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z';

const SkeletonImage = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonImage',
  props: omit(skeletonElementProps(), ['size', 'shape', 'active']),
  setup(props) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const cls = computed(() =>
      classNames(prefixCls.value, `${prefixCls.value}-element`, hashId.value),
    );
    return () => {
      return wrapSSR(
        <div class={cls.value}>
          <div class={`${prefixCls.value}-image`}>
            <svg
              viewBox="0 0 1098 1024"
              xmlns="http://www.w3.org/2000/svg"
              class={`${prefixCls.value}-image-svg`}
            >
              <path d={path} class={`${prefixCls.value}-image-path`} />
            </svg>
          </div>
        </div>,
      );
    };
  },
});

export default SkeletonImage;
