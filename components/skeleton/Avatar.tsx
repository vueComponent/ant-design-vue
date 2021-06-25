import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { SkeletonElementProps } from './Element';
import Element, { skeletonElementProps } from './Element';

export interface AvatarProps extends Omit<SkeletonElementProps, 'shape'> {
  shape?: 'circle' | 'square';
}

export const avatarProps = initDefaultProps(
  { ...skeletonElementProps(), shape: PropTypes.oneOf(tuple('circle', 'square')) },
  {
    size: 'large',
  },
);

const SkeletonAvatar = defineComponent({
  name: 'ASkeletonAvatar',
  props: avatarProps,
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
          <Element {...props} prefixCls={`${prefixCls.value}-avatar`} />
        </div>
      );
    };
  },
});

export default SkeletonAvatar;
