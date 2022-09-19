import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { SkeletonElementProps } from './Element';
import Element, { skeletonElementProps } from './Element';
import omit from '../_util/omit';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
}

const SkeletonInput = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonInput',
  props: {
    ...omit(skeletonElementProps(), ['shape']),
    size: String as PropType<'large' | 'small' | 'default'>,
  },
  setup(props) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const cls = computed(() =>
      classNames(prefixCls.value, `${prefixCls.value}-element`, {
        [`${prefixCls.value}-active`]: props.active,
      }),
    );
    return () => {
      return (
        <div class={cls.value}>
          <Element {...props} prefixCls={`${prefixCls.value}-input`} />
        </div>
      );
    };
  },
});

export default SkeletonInput;
