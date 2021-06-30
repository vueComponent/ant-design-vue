import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { SkeletonElementProps } from './Element';
import Element, { skeletonElementProps } from './Element';

export interface SkeletonButtonProps extends Omit<SkeletonElementProps, 'size'> {
  size?: 'large' | 'small' | 'default';
}

const SkeletonButton = defineComponent({
  name: 'ASkeletonButton',
  props: { ...skeletonElementProps(), size: PropTypes.oneOf(tuple('large', 'small', 'default')) },
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
          <Element {...props} prefixCls={`${prefixCls.value}-button`} />
        </div>
      );
    };
  },
});

export default SkeletonButton;
